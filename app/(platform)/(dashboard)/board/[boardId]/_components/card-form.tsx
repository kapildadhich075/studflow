"use client";

import { forwardRef, ElementRef, KeyboardEventHandler, useRef } from "react";
import { Image, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";
import { createCard } from "@/actions/create-card";
import { useOnClickOutside, useEventListener } from "usehooks-ts";

interface CardFormProps {
  enableEditing: () => void;
  disableEditing: () => void;
  listId: string;
  isEditing: boolean;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ enableEditing, disableEditing, listId, isEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        disableEditing();
        toast.success(`Card "${data.title}" created successfully`);
        formRef.current?.reset();
      },
      onError: () => {
        toast.error("Failed to create card");
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useOnClickOutside(formRef, () => {
      disableEditing();
    });
    useEventListener("keydown", () => {
      onKeyDown;
    });

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = params.boardId as string;

      execute({ title, listId, boardId });
    };

    if (isEditing) {
      return (
        <form
          className="m-1 py-0.5 px-1 space-y-4"
          ref={formRef}
          action={onSubmit}
        >
          <FormTextarea
            onClick={() => {}}
            ref={ref}
            id="title"
            placeholder="Enter a title for this card"
            onKeyDown={onTextareaKeyDown}
            errors={fieldErrors}
          />
          <input hidden id="listId" name="listId" value={listId} />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add Card</FormSubmit>
            <Button size={"sm"} variant={"link"}>
              <Image className="h-4 w-4" />
            </Button>
            <Button onClick={disableEditing} size={"sm"} variant={"ghost"}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      );
    } else {
      disableEditing();
    }

    return (
      <>
        <div className=" pt-2 px-2">
          <Button
            onClick={enableEditing}
            className="h-auto px-2 py-1.5 w-full justify-start text-muted-foregroundtext-sm"
            size={"sm"}
            variant={"ghost"}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>
      </>
    );
  }
);

CardForm.displayName = "CardForm";
