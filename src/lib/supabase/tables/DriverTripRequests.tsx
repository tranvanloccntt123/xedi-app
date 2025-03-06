import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";
import {
  IDriverTripRequest,
  IDriverTripRequestStatus,
  SupabaseTableFilter,
} from "@/src/types";

export default class DriverTripRequests extends BaseTable<IDriverTripRequest> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.DRIVER_TRIP_REQUESTS);
  }

  async selectRequestOrderAccepted(data: { tripRequestId: number }) {
    try {
      this.validateSupbase();

      let query = this.supabase
        .from(this.tableName)
        .select(`*, ${Tables.USERS}(*)` as "*");

      const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
      if (!userId) throw "User is empty";

      if (userId) {
        query = query.eq("user_id", userId);
      }

      return query
        .eq("trip_request_id", data.tripRequestId)
        .eq("status", IDriverTripRequestStatus.CUSTOMER_ACCEPT)
        .order("id", { ascending: true });
    } catch (e) {
      throw e;
    }
  }

  async selectRequestOrdered(data: {
    userId?: string;
    tripRequestId: number;
  }): Promise<SupabaseTableFilter<IDriverTripRequest>> {
    try {
      this.validateSupbase();

      let query = this.supabase
        .from(this.tableName)
        .select(`*, ${Tables.USERS}(*)` as "*");

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
