import { SupabaseClient } from "@supabase/supabase-js";
import FixedRoutes from "./FixedRoutes";
import Feed from "./Feed";
import Users from "./Users";
import FixedRouteOrders from "./FixedRouteOrder";
import Profiles from "./Profiles";

export class XediTables {
  fixedRoutes: FixedRoutes;
  feed: Feed;
  users: Users;
  fixedRouteOrders: FixedRouteOrders;
  profiles: Profiles;
  constructor(supabase: SupabaseClient) {
    this.fixedRoutes = new FixedRoutes(supabase);
    this.feed = new Feed(supabase);
    this.users = new Users(supabase);
    this.fixedRouteOrders = new FixedRouteOrders(supabase);
    this.profiles = new Profiles(supabase);
  }
}
