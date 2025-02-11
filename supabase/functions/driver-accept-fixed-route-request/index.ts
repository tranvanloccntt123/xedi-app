// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { JWT } from 'npm:google-auth-library@9'
import serviceAccount from '../xedi-66660-firebase-adminsdk-fbsvc-05125ce8da.json' with { type: 'json' }

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

  if (data) {
    return new Response(
      JSON.stringify({
        message: "Order not found",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 404,
      }
    );
  }

  await supabase
    .from("fixed_route_orders")
    .update({status: 1})
    .eq("id", id)
    .select();

  const { user_id } = data;

  const { data: profileData } = await supabase
    .from("profiles")
    .select("fcm_token")
    .eq("id", user_id)
    .single();

    const fcmToken = profileData!.fcm_token as string

    const accessToken = await getAccessToken({
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    })
  
    const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: {
            token: fcmToken,
            notification: {
              title: `Xedi - thông báo`,
              body: 'Tài xế đã xác nhận chuyến đi, chúc bạn có một chuyến đi vui vẻ!',
            },
          },
        }),
      }
    )
  
    const resData = await res.json()
    if (res.status < 200 || 299 < res.status) {
      throw resData
    }

  return new Response(JSON.stringify({
    message: 'Xác nhận yêu cầu thành công'
  }), {
    headers: { "Content-Type": "application/json" },
  });
});

const getAccessToken = ({
  clientEmail,
  privateKey,
}: {
  clientEmail: string
  privateKey: string
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    })
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens!.access_token!)
    })
  })
}