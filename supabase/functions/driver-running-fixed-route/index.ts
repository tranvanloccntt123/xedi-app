// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  const { id } = await req.json();

  const { data } = await supabase
    .from("fixed_route_orders")
    .select("user_id")
    .eq("fixed_route_id", id);

  if (data?.length) {
    const { data: notification_data, error: notification_error } =
      await supabase.functions.invoke("push-multi-notifications", {
        body: JSON.stringify({
          type: "FIXED_ROUTE_RUNNING",
          schema: "public",
          record: {
            user_ids: data.map((v) => v.user_id),
            body: `Tài xế đã bắt đầu hành trình, vui lòng chuẩn bị hành lí để chuyến đi diễn ra thuận tiện nhé!`,
            title: "Bắt đầu hành trình nào!",
          },
        } as WebhookMultiNotificationPayload),
      });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/driver-running-fixed-route' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
