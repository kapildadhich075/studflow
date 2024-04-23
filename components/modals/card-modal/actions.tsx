"use client";

import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";

import { CardwithList } from "@/types";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { toast } from "sonner";
import { useCardModal } from "@/hooks/use-card-modal";

interface ActionsProps {
  data: CardwithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();
  const { execute: executeCopy, loading: isLoadingCopy } = useAction(copyCard, {
    onSuccess: (data) => {
      toast.success(`Card copied to ${data.title}`);
      cardModal.onClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeDelete, loading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: () => {
        toast.success("Card deleted");
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopy({ id: data.id, boardId });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDelete({ id: data.id, boardId });
  };
  return (
    <>
      <div className=" space-y-2 mt-2">
        <p className=" text-xs font-semibold">Actions</p>
        <Button
          onClick={onCopy}
          disabled={isLoadingCopy}
          variant={"gray"}
          size={"inline"}
          className=" w-full justify-start"
        >
          <Copy className=" w-4 h-4 mr-2" /> Copy
        </Button>
        <Button
          onClick={onDelete}
          disabled={isLoadingDelete}
          variant={"destructive"}
          size={"inline"}
          className=" w-full justify-start"
        >
          <Trash className=" w-4 h-4 mr-2" /> Delete
        </Button>
      </div>
    </>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div>
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
