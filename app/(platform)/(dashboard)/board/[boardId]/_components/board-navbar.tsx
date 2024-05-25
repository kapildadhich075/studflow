import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";
import BoardOptions from "./board-options";
import { Button } from "@/components/ui/button";
import { Image as Screenshot } from "lucide-react";
import html2canvas from "html2canvas";

interface BoardNavbarProps {
  data: Board;
  id: string;
}

const BoardNavbar = async ({ data, id }: BoardNavbarProps) => {
  const { orgId } = auth();

  return (
    <>
      <div
        className="w-full h-14 z-[40] bg-slate-900/20 fixed top-14 flex items-center
      px-6 gap-x-4 text-white"
      >
        <BoardTitleForm data={data} />
        <div className="ml-auto">
          <BoardOptions id={data.id} screenShotId={id} />
        </div>
      </div>
    </>
  );
};

export default BoardNavbar;
