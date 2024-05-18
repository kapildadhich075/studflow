import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { MAX_FREE_BOARDS } from "@/constants/boards";

export const incrementAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return;
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: {
      orgId,
    },
  });
};
