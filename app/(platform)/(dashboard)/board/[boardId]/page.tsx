import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ListContainer } from "./_components/list-container";

interface BoardPageIdProps {
  params: {
    boardId: string;
  };
}

const BoardPageId = async ({ params }: BoardPageIdProps) => {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        orgId,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <>
      <div className="p-4 h-full overflow-x-auto" id="board">
        <ListContainer boardId={params.boardId} data={lists} />
      </div>
    </>
  );
};

export default BoardPageId;
