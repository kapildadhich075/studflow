"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal, X } from "lucide-react";

import { DeleteBoard } from "@/actions/delete-board/schema";
import { useAction } from "@/hooks/use-action";
import { deleteBoard } from "@/actions/delete-board";
import { toast } from "sonner";

interface BoardOptionsProps {
  id: string;
}

const BoardOptions = ({ id }: BoardOptionsProps) => {
  const { execute, loading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error("Failed to delete board");
    },
  });

  const onDelete = () => {
    execute({ id });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="h-auto w-auto p-2" variant={"transparent"}>
          <MoreHorizontal className="h-4 w-4 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center  text-neutral-600 pb-4">
          Board Actions
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto  w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant={"ghost"}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </PopoverClose>
        <Button
          variant={"ghost"}
          className="w-full rounded-none h-auto p-2 px-5 justify-start font-normal text-sm"
          onClick={onDelete}
          disabled={loading}
        >
          Delete Board
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default BoardOptions;
