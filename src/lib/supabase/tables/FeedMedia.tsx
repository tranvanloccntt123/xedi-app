import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

export default class FeedMedia extends BaseTable<IFeedMedia, IFeedMediaSource> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.FEED_MEDIA);
  }
}
