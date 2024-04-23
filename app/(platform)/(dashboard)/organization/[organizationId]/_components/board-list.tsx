import { HelpCircle, User2 } from "lucide-react";

import { FormPopover } from "@/components/form/form-popover";
import { db } from "@/lib/db";
import { Hint } from "@/components/hint";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";

export const BoardList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const boards = await db.board.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center font-semibold text-lg text-neutral-700">
          <User2 className="h-6 w-6 mr-2" />
          Your Boards
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
              style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
              <p className="relative font-semibold text-white">{board.title}</p>
            </Link>
          ))}
          <FormPopover sideOffset={10} side="right">
            <div
              role="button"
              className="aspect-video relative h-full w-full bg-muted
            rounded-sm flex flex-col gap-y-1 items-center justify-center
            hover:opacity-75 transition "
            >
              <p className="text-sm">Create New Board</p>
              {/* <Hint
                description="
                Free users can create up to 5 boards. Upgrade to create more.
            "
              >
                <HelpCircle className=" absolute bottom-2 right-2 h-[14px] w-[14px]" />
              </Hint> */}
            </div>
          </FormPopover>
        </div>
      </div>
    </>
  );
};

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton className="aspect-video h-full w-full p-2" key={i} />
      ))}
    </div>
  );
};
