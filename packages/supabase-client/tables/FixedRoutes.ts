import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

export default class FixedRoutes extends BaseTable<IFixedRoute> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.FIXED_ROUTES);
  }
  
  async addFixedRoutes(_data: Array<IFixedRoute>) {
    try {
      return this.add(
        _data.map((v) => ({
          start_location: v.start_location,
          end_location: v.end_location,
          departure_time: v.departure_time,
          total_seats: v.total_seats,
          available_seats: v.available_seats,
          price: v.price,
          created_at: v.created_at.toISOString(),
          user_id: v.user_id,
        }))
      );
    } catch (e) {
      console.warn(e);
    }
  }

  async runningFixedRoute(id: number) {
    const { data, error } = await this.supabase.functions.invoke(
      "driver-running-fixed-route",
      {
        body: JSON.stringify({ id }),
      }
    );
    return { data, error };
  }

  async finishedFixedRoute(id: number) {
    const { data, error } = await this.supabase.functions.invoke(
      "driver-finish-fixed-route",
      {
        body: JSON.stringify({ id }),
      }
    );
    return { data, error };
  }
}
