import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";
import { IDriverTripRequest, SupabaseTableFilter } from "@/src/types";
import { Q } from "@expo/html-elements";

export default class DriverTripRequests extends BaseTable<IDriverTripRequest> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.DRIVER_TRIP_REQUESTS);
  }

  async selectRequestOrdered(data: {
    userId?: string;
    tripRequestId: number;
  }): Promise<SupabaseTableFilter<IDriverTripRequest>> {
    try {
      this.validateSupbase();

      let query = this.supabase.from(this.tableName).select(`*, ${Tables.USERS}(*)` as "*");

      if (data.userId) {
        query = query.eq("user_id", data.userId);
      }

      return query
        .eq("trip_request_id", data.tripRequestId)
        .order("id", { ascending: true });
    } catch (e) {
      throw e;
    }
  }
}
