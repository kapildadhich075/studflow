"use client";

import { useState, useRef, ElementRef } from "react";
import { List } from "@prisma/client";
import { useEventListener } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { updateList } from "@/actions/update-list";
import { toast } from "sonner";
import { ListOptions } from "./list-options";

interface ListHeaderProps {
  data: List;
}

export const ListHeader = ({ data }: ListHeaderProps) => {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`Renamed list to ${data.title}`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error("Failed to rename list");
    },
  });

  const onkeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.form?.requestSubmit();
    }
  };

  const handleSubmit = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    const title = formData.get("title") as string;

    execute({ id, boardId, title });
  };
  const onBlur = () => {
    formRef.current?.form?.requestSubmit();
  };

  useEventListener("keydown", onkeyDown);
  return (
    <>
      <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
        {isEditing ? (
          <form action={handleSubmit} className="flex-1 px-[2px]" ref={formRef}>
            <input name="id" id="id" hidden value={data.id} />
            <input name="boardId" id="boardId" hidden value={data.boardId} />
            <FormInput
              ref={inputRef}
              onBlur={onBlur}
              id="title"
              placeholder="Enter List Title"
              defaultValue={title}
              className=" text-sm px-[7px] py-1 h-7 font-medium border-transparent 
              hover:border-input focus:border-input transition truncate
              bg-transparent focus:bg-white
              "
            />
            <button type="submit" hidden />
          </form>
        ) : (
          <div
            onClick={enableEditing}
            className="w-full text-sm px-2.5 py-2 h-7 font-medium border-transparent"
          >
            {title}
          </div>
        )}

        <ListOptions data={data} onAddCard={() => {}} />
      </div>
    </>
  );
};
