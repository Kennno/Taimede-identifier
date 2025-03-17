import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_KEY");

if (
  !STRIPE_SECRET_KEY ||
  !STRIPE_WEBHOOK_SECRET ||
  !SUPABASE_URL ||
  !SUPABASE_SERVICE_KEY
) {
  console.error("Missing environment variables");
}

const stripe = new (await import("https://esm.sh/stripe@12.0.0")).default(
  STRIPE_SECRET_KEY,
);
const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        `Webhook signature verification failed: ${err.message}`,
        { status: 400 },
      );
    }

    console.log(`Event received: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await handleInvoicePaymentFailed(invoice);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function handleCheckoutSessionCompleted(session) {
  try {
    // Get customer and subscription details
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    const userId = session.client_reference_id;

    if (!userId) {
      console.error("No user ID found in session");
      return;
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const planId = subscription.items.data[0].plan.id;

    // Update or create subscription in Supabase
    const { data, error } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: subscription.status,
        plan_id: planId,
        current_period_start: new Date(
          subscription.current_period_start * 1000,
        ).toISOString(),
        current_period_end: new Date(
          subscription.current_period_end * 1000,
        ).toISOString(),
        cancel_at: subscription.cancel_at
          ? new Date(subscription.cancel_at * 1000).toISOString()
          : null,
        canceled_at: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : null,
        trial_start: subscription.trial_start
          ? new Date(subscription.trial_start * 1000).toISOString()
          : null,
        trial_end: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Error updating subscription in database:", error);
    } else {
      console.log("Subscription updated successfully:", data);
    }
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    // Get customer ID from subscription
    const customerId = subscription.customer;

    // Find the user associated with this customer
    const { data: customerData, error: customerError } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (customerError || !customerData) {
      console.error(
        "Error finding user for customer:",
        customerError || "No customer found",
      );
      return;
    }

    const userId = customerData.user_id;
    const planId = subscription.items.data[0].plan.id;

    // Update subscription in database
    const { error } = await supabase.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      plan_id: planId,
      current_period_start: new Date(
        subscription.current_period_start * 1000,
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000,
      ).toISOString(),
      cancel_at: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error updating subscription:", error);
    } else {
      console.log(`Subscription ${subscription.id} updated for user ${userId}`);
    }
  } catch (error) {
    console.error("Error handling subscription updated:", error);
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    // Update subscription status to canceled in database
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id);

    if (error) {
      console.error("Error updating subscription to canceled:", error);
    } else {
      console.log(`Subscription ${subscription.id} marked as canceled`);
    }
  } catch (error) {
    console.error("Error handling subscription deleted:", error);
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  try {
    if (!invoice.subscription) {
      console.log("Invoice is not associated with a subscription");
      return;
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription,
    );

    // Find the user associated with this subscription
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", invoice.subscription)
      .single();

    if (subscriptionError || !subscriptionData) {
      console.error(
        "Error finding subscription:",
        subscriptionError || "No subscription found",
      );
      return;
    }

    // Update subscription with new period end date
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: subscription.status,
        current_period_end: new Date(
          subscription.current_period_end * 1000,
        ).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", invoice.subscription);

    if (error) {
      console.error("Error updating subscription after payment:", error);
    } else {
      console.log(
        `Subscription ${invoice.subscription} updated after successful payment`,
      );
    }
  } catch (error) {
    console.error("Error handling invoice payment succeeded:", error);
  }
}

async function handleInvoicePaymentFailed(invoice) {
  try {
    if (!invoice.subscription) {
      console.log("Invoice is not associated with a subscription");
      return;
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription,
    );

    // Update subscription status in database
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: subscription.status, // This will be 'past_due' or 'unpaid'
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", invoice.subscription);

    if (error) {
      console.error("Error updating subscription after failed payment:", error);
    } else {
      console.log(
        `Subscription ${invoice.subscription} updated after failed payment`,
      );
    }
  } catch (error) {
    console.error("Error handling invoice payment failed:", error);
  }
}
