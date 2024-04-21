"use client";

import { CardwithList } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlignLeft } from "lucide-react";

interface DescriptionProps {
  data: CardwithList;
}

export const Description = ({ data }: DescriptionProps) => {
  return (
    <>
      <div className=" flex items-start gap-x-3 w-full">
        <AlignLeft className="h-5 w-5 text-neutral-700 mt-0.5" />
        <div className=" w-full">
          <p className=" font-semibold text-neutral-700 mb-2">Description</p>
          <div
            role={"button"}
            className=" min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {data.description || "Add Detailed Description"}
          </div>
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
