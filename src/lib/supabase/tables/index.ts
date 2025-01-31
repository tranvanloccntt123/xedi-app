import { SupabaseClient } from "@supabase/supabase-js";
import FixedRoutes from "./FixedRoutes";
import Feed from "./Feed";
import Users from "./Users";

export class XediTables {
  fixedRoutes: FixedRoutes;
  feed: Feed;
  users: Users;
  constructor(supabase: SupabaseClient) {
    this.fixedRoutes = new FixedRoutes(supabase);
    this.feed = new Feed(supabase);
    this.users = new Users(supabase);
  }
}
