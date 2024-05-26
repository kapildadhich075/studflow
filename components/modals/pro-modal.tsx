"use client";

import { useProModal } from "@/hooks/use-pro-modal";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

export const ProModal = () => {
  const proModal = useProModal();

  const { execute, loading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = () => {
    execute({});
  };

  const isOpen = proModal.isOpen;
  const onOpenChange = proModal.onClose;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className=" max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image
            src="/subscription.jpg"
            alt="Hero"
            className=" object-cover"
            fill
          />
        </div>
        <div className="text-neutral-700 mx-auto space-y-6 p-6">
          <h2 className="text-xl font-semibold text-center">
            Upgrade to Studflow Pro! 🚀
          </h2>
          <p className="text-xs font-semibold text-neutral-600 text-center">
            Explore the best features of Studflow Pro! 🎉
          </p>
          <div className=" pl-3">
            <ul className="text-sm list-disc">
              <li>Unlimited Boards</li>
              <li>Advance Checklists</li>
              <li>Admin and Security features</li>
              <li>And much more...</li>
            </ul>
          </div>
          <Button
            className=" w-full"
            variant={"primary"}
            onClick={onClick}
            disabled={loading}
          >
            Upgrade to Pro!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
