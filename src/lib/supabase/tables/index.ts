import { SupabaseClient } from "@supabase/supabase-js";
import FixedRoutes from "./FixedRoutes";
import Feed from "./Feed";
import Users from "./Users";
import FixedRouteOrders from "./FixedRouteOrder";
import Profiles from "./Profiles";
import Notifications from "./Notifications";
import UserCoins from "./UserCoins";
import TripRequests from "./TripRequests";
import DriverTripRequests from "./DriverTripRequests";
import MergeTripRequests from "./MergeTripRequests";

export class XediTables {
  fixedRoutes: FixedRoutes;
  feed: Feed;
  users: Users;
  fixedRouteOrders: FixedRouteOrders;
  profiles: Profiles;
  notifications: Notifications;
  userCoins: UserCoins;
  tripRequest: TripRequests;
  driverTripRequests: DriverTripRequests;
  mergeTripRequests: MergeTripRequests;

  constructor(supabase: SupabaseClient) {
    this.fixedRoutes = new FixedRoutes(supabase);
    this.feed = new Feed(supabase);
    this.users = new Users(supabase);
    this.fixedRouteOrders = new FixedRouteOrders(supabase);
    this.profiles = new Profiles(supabase);
    this.notifications = new Notifications(supabase);
    this.userCoins = new UserCoins(supabase);
    this.tripRequest = new TripRequests(supabase);
    this.driverTripRequests = new DriverTripRequests(supabase);
    this.mergeTripRequests = new MergeTripRequests(supabase);
  }
}
