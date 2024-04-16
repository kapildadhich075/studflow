"use client";

import { forwardRef } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CardFormProps {
  enableEditing: () => void;
  disableEditing: () => void;
  listId: string;
  isEditing: boolean;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ enableEditing, disableEditing, listId, isEditing }, ref) => {
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
