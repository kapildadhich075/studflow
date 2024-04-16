"use client";

import { List } from "@prisma/client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { deleteList } from "@/actions/delete-list";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import { copyList } from "@/actions/copy-list";

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

export const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" deleted`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error("Failed to delete list");
    },
  });

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" copied`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error("Failed to copy list");
    },
  });

  const onCopy = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    executeCopy({ id, boardId });
  };

  const onDelete = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    executeDelete({ id, boardId });
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost" asChild className=" h-auto w-auto p-2">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
          <div className="text-sm font-medium text-center text-neutral-600">
            List Actions
          </div>
          <PopoverClose asChild>
            <Button
              className=" h-auto w-auto p-2 absolute top-2 right-2
            text-neutral-600
            "
              ref={closeRef}
              variant={"ghost"}
            >
              <X className="h-4 w-4 " />
            </Button>
          </PopoverClose>
          <Button
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            onClick={onAddCard}
            variant={"ghost"}
          >
            Add Card
          </Button>
          <form action={onCopy}>
            <input name="id" id="id" hidden value={data.id} />
            <input name="boardId" id="boardId" hidden value={data.boardId} />
            <FormSubmit
              className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
              variant={"ghost"}
            >
              Copy List
            </FormSubmit>
          </form>
          <Separator />
          <form action={onDelete}>
            <input name="id" id="id" hidden value={data.id} />
            <input name="boardId" id="boardId" hidden value={data.boardId} />
            <FormSubmit
              className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
              variant={"ghost"}
            >
              Delete List
            </FormSubmit>
          </form>
        </PopoverContent>
      </Popover>
    </>
  );
};
