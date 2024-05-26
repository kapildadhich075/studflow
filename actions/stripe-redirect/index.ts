"use server";

import { revalidatePath } from "next/cache";

import { auth, currentUser } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { StripeRedirect } from "./schema";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return {
      error: "Unauthenticated",
    };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);

  let url = "";

  try {
    const orgSubscription = await db.orgSubscription.findUnique({
      where: {
        orgId,
      },
    });

    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      url = stripeSession.url;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer_email: user?.emailAddresses[0].emailAddress,
        shipping_address_collection: {
          allowed_countries: ["IN"],
        },
        billing_address_collection: "auto",
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Pro Plan",
                description: "Unlimited access to all features",
              },
              unit_amount: 79900,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      });

      url = stripeSession.url || "";
    }
  } catch (error) {
    return {
      error: "Failed to create Stripe session",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  return {
    data: url,
  };
};

export const stripeRedirect = createSafeAction(StripeRedirect, handler);
