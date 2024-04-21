"use client";

import { ElementRef, useRef, useState } from "react";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { Skeleton } from "@/components/ui/skeleton";
import { CardwithList } from "@/types";
import { updateCard } from "@/actions/update-card";
import { toast } from "sonner";

interface HeaderProps {
  data: CardwithList;
}

export const Header = ({ data }: HeaderProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });

      toast.success(`Rename to ${data.title}`);
      setTitle(data.title);
    },
    onError: () => {
      toast.error("Failed to update card");
    },
  });

  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title);

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = params.boardId as string;

    if (title === data.title) return;

    execute({ title, boardId, id: data.id });
  };

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="w-5 h-5 text-neutral-700 mt-1" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            onBlur={onBlur}
            ref={inputRef}
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative
            -left-1.5  w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate
            "
          />
        </form>
        <p className=" text-sm text-muted-foreground">
          in list{" "}
          <span className="text-neutral-500 underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className=" flex items-start gap-x-3 mb-6">
      <Skeleton className="w-6 h-6 mt-1 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className=" w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className=" w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};
