import { SupabaseClient } from "@supabase/supabase-js";
import FixedRoutes from "./FixedRoutes";
import Feed from "./Feed";

export class XediTables {
  fixedRoutes: FixedRoutes;
  feed: Feed;
  constructor(supabase: SupabaseClient) {
    this.fixedRoutes = new FixedRoutes(supabase);
    this.feed = new Feed(supabase);
  }
}
