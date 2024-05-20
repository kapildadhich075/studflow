"use client";

import { toast } from "sonner";
import { X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";

import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { Button } from "@/components/ui/button";
import { FormPicker } from "./form-picker";
import { ElementRef, useRef } from "react";
import { useProModal } from "@/hooks/use-pro-modal";
import { useRouter } from "next/navigation";

interface FormPopoverProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const FormPopover = ({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
}: FormPopoverProps) => {
  const proModal = useProModal();
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success("Board created");
      closeRef.current?.click();
      router.push(`/board/${data.id}`);
    },
    onError: (error) => {
      toast.error(
        "Failed to create board, You have reached the maximum number of boards. Upgrade your plan to create more boards."
      );
      proModal.onOpen();
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;

    execute({ title, image });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side={side} align={align} sideOffset={sideOffset}>
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create New Board
        </div>
        <PopoverClose asChild ref={closeRef}>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 "
            variant={"ghost"}
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form className="space-y-4" action={onSubmit}>
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors}></FormPicker>
            <FormInput
              id="title"
              errors={fieldErrors}
              label="Board Title"
              type="text"
            />
          </div>
          <FormSubmit className="w-full">Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
