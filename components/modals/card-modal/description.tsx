"use client";

import { useState, useRef, ElementRef, Key } from "react";
import { AlignLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { CardwithList } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";

interface DescriptionProps {
  data: CardwithList;
}

export const Description = ({ data }: DescriptionProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      toast.success(`Card "${data.title}" updated successfully`);
      disableEditing();
    },
    onError: () => {
      toast.error("Failed to update description");
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    const boardId = params.boardId as string;

    execute({
      id: data.id,
      description,
      boardId,
    });
  };

  return (
    <>
      <div className=" flex items-start gap-x-3 w-full">
        <AlignLeft className="h-5 w-5 text-neutral-700 mt-0.5" />
        <div className=" w-full">
          <p className=" font-semibold text-neutral-700 mb-2">Description</p>
          {isEditing ? (
            <form action={onSubmit} ref={formRef} className="space-y-2">
              <FormTextarea
                id="description"
                className="w-full mt-2"
                placeholder="Add Detailed Description"
                defaultValue={data.description || undefined}
                errors={fieldErrors}
                ref={textAreaRef}
              />
              <div className=" flex items-center gap-x-2">
                <FormSubmit>Save</FormSubmit>
                <Button
                  type="button"
                  onClick={disableEditing}
                  size={"sm"}
                  variant={"ghost"}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div
              onClick={enableEditing}
              role={"button"}
              className=" min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
            >
              {data.description || "Add Detailed Description"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Description.Skeleton = function DescriptionSkelton() {
  return (
    <div className=" flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className=" w-full">
        <Skeleton className="h-6 w-24 bg-neutral-200" />
        <Skeleton className="h-[78px] w-full bg-neutral-200" />
      </div>
    </div>
  );
};
