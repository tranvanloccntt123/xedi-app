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

//TODO
Deno.serve(async (req) => {
  const { id } = await req.json();

  const { data } = await supabase
    .from("fixed_route_orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    return new Response(
      JSON.stringify({
        message: "Không tìm thấy yêu cầu " + id,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 404,
      }
    );
  }

  const { data: fixedRoute } = await supabase
    .from("fixed_routes")
    .select("*")
    .eq("id", data.fixed_route_id)
    .single();

  if (!fixedRoute) {
    return new Response(
      JSON.stringify({
        message: "Không tìm thấy hành trình " + id,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 404,
      }
    );
  }

  const { error } = await supabase
    .from("fixed_route_orders")
    .update({ status: 1 })
    .eq("id", id)
    .select();

  if (error) {
    return new Response(
      JSON.stringify({
        message: "Cập nhật yêu cầu " + id,
        error,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 404,
        statusText: JSON.stringify(error),
      }
    );
  }

  const { user_id } = data;

  const { data: notification_data, error: notification_error } =
    await supabase.functions.invoke("push-multi-notifications", {
      body: JSON.stringify({
        type: "FIXED_ROUTE_ORDER_UPDATE",
        schema: "public",
        record: {
          user_ids: [user_id],
          body: `Tài xế đã xác nhận yêu cầu từ ${data.phone_number}, chúc bạn có hành trình vui vẻ!.`,
          title: "Xác nhận yêu cầu thành công",
          fromId: fixedRoute.user_id
        },
      } as WebhookMultiNotificationPayload),
    });

  if (notification_error) {
    return new Response(
      JSON.stringify({
        message: "Xác nhận yêu cầu thành công",
        notification: {
          data: notification_data,
          error: notification_error,
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Xác nhận yêu cầu thành công",
      notification: {
        data: notification_data,
        error: notification_error,
      },
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});
