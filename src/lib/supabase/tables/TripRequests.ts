import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

export default class TripRequests extends BaseTable<ITripRequest> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.TRIP_REQUESTS);
  }
}
