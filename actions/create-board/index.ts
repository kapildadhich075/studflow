"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { ENTITY_TYPE, ACTION } from ".prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";
import {
  incrementAvailableCount,
  hasAvailableCount,
  decreaseAvailableCount,
} from "@/lib/org-limit";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthenticated",
    };
  }

  const canCreate = await hasAvailableCount();

  console.log("canCreate", canCreate);

  if (!canCreate) {
    return {
      error:
        "You have reached the maximum number of boards. Upgrade your plan to create more boards.",
    };
  }

  const { title, image } = data;

  const [imageId, imageThumbUrl, imageFullUrl, imageUserName, imageLinkHTML] =
    image.split("|");

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageUserName ||
    !imageLinkHTML
  ) {
    return {
      error: "Missing fields. Failed to create board",
    };
  }

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML,
      },
    });

    await incrementAvailableCount();

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
  } catch (e) {
    return {
      error: "Failed to create board",
    };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
