// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { initializeApp, cert } from "npm:firebase-admin/app";
import {getMessaging} from 'npm:firebase-admin/messaging';
import serviceAccount from '../xedi-66660-firebase-adminsdk-fbsvc-05125ce8da.json' with { type: 'json' }
import { createClient } from 'npm:@supabase/supabase-js@2'

const app = initializeApp({
  credential: cert(serviceAccount)
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const payload: WebhookMultiNotificationPayload = await req.json()

  const { data } = await supabase
  .from('profiles')
  .select('fcm_token')
  .in('id', payload.record.user_ids || []);

  const payloadMessage = {
    data: {
      type: payload.type,
      title: `Xedi - ${ payload.record.title || 'Thông báo'}`,
      body: payload.record.body,
    },
    notification: {
      title: `Xedi - ${ payload.record.title || 'Thông báo'}`,
      body: payload.record.body,
    },
    tokens: data.map(v => v.fcm_token),
  };

  data?.length && getMessaging().sendEachForMulticast(payloadMessage);

  await supabase.from('notifications').insert(payload.record.user_ids.map(v => ({
    user_id: v,
    body: payload.record.body,
    from_id: payload.record.fromId || null
  }))).select();

  return new Response(
    JSON.stringify({
      title: `Xedi - ${ payload.record.title || 'Thông báo'}`,
      body: payload.record.body,
    }),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/push-multi-notifications' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
