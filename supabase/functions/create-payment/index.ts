
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Create Supabase client using service role to bypass RLS
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  try {
    const { items, total, customerInfo } = await req.json();
    
    // Validate required data
    if (!items || !total) {
      throw new Error("Missing required order data");
    }
    
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: "Order Payment",
            description: `Order with ${items.length} items`,
          },
          unit_amount: Math.round(total * 100), // Convert to cents
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/returns?success=true`,
      cancel_url: `${req.headers.get("origin")}/place-order?canceled=true`,
    });

    // Create order record in the database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        stripe_session_id: session.id,
        customer_name: customerInfo?.name || 'Guest',
        customer_email: customerInfo?.email || 'guest@example.com',
        customer_address: customerInfo?.address || '',
        items: items,
        total: total,
        status: 'Processing',
        payment_method: 'Credit Card',
        payment_status: 'Pending'
      }])
      .select();
      
    if (orderError) {
      console.error("Error saving order:", orderError);
      // Continue with the checkout even if order save fails
    }

    return new Response(
      JSON.stringify({ 
        url: session.url,
        session_id: session.id,
        order_id: order?.[0]?.id
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Payment error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
