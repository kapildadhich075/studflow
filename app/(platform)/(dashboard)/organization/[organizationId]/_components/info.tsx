"use client";

import { CreditCard, Timer } from "lucide-react";

import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface InfoProps {
  isPro: boolean;
}

export const Info = ({ isPro }: InfoProps) => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return (
      <div>
        <Info.Skeleton></Info.Skeleton>
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center gap-x-4">
        <div className="w-[60px] h-[60px] relative">
          <Image
            fill
            src={organization?.imageUrl!}
            alt={"Organization logo"}
            className="rounded-md object-cover"
          />
        </div>
        <div className="space-y-1">
          <p className="fonr-semibold text-xl">{organization?.name}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <CreditCard className="h-3 w-3 mr-1" />
            {isPro ? "Pro Plan" : "Free Plan"}
          </div>
        </div>
      </div>
    </>
  );
};

Info.Skeleton = function SkeletonInfo() {
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        <Skeleton className="w-full h-full absolute" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-[200px] h-10" />
        <div className="flex items-center">
          <Skeleton className="w-4 h-4 mr-2" />
          <Skeleton className="w-[100px] h-4" />
        </div>
      </div>
    </div>
  );
};
