import { Tables } from "@/src/constants";
import { IFixedRoute } from "@/src/types";
import { SupabaseClient } from "@supabase/supabase-js";

type FixedRouteDB = {
  id: number;
  user_id: string;
  startLocation: string;
  endLocation: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  created_at: Date;
};

export default class FixedRoutes {
  supabase?: SupabaseClient | null = null;
  constructor(_supabase: SupabaseClient) {
    this.supabase = _supabase;
  }
  async addFixedRoutes(_data: Array<IFixedRoute>) {
    try {
      if (!this.supabase) return;
      const { data, error } = await this.supabase
        .from(Tables.FIXED_ROUTES)
        .insert(
          _data.map((v) => ({
            startLocation: v.startLocation,
            endLocation: v.endLocation,
            departureTime: v.departureTime,
            totalSeats: v.totalSeats,
            availableSeats: v.availableSeats,
            price: v.price,
            created_at: v.created_at.toISOString(),
            user_id: v.user_id,
          }))
        )
        .select();
      return { data, error };
    } catch (e) {
      console.warn(e);
    }
  }
}

