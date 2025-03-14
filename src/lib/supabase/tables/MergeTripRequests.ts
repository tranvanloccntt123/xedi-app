import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";
import { IMergeTripRequest } from "@/src/types";

export default class MergeTripRequests extends BaseTable<IMergeTripRequest> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.MERGE_TRIP_REQUESTS);
  }
}
