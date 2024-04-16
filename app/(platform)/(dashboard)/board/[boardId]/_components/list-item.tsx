"use client";

import { ElementRef, useRef, useState } from "react";

import { ListwithCards } from "@/types";
import { ListHeader } from "./list-header";
import { CardForm } from "./card-form";

interface ListItemProps {
  list: ListwithCards;
  index: number;
}

export const ListItem = ({ list, index }: ListItemProps) => {
  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(true);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  };

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className=" w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        <ListHeader onAddCard={enableEditing} data={list} />
        <CardForm
          listId={list.id}
          ref={textAreaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </li>
  );
};
