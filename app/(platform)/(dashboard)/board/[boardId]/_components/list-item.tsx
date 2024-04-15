"use client";

import { ListwithCards } from "@/types";
import { ListHeader } from "./list-header";

interface ListItemProps {
  list: ListwithCards;
  index: number;
}

export const ListItem = ({ list, index }: ListItemProps) => {
  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className=" w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        <ListHeader data={list} />
      </div>
    </li>
  );
};
