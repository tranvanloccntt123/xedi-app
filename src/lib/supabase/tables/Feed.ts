import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

interface IFeedSupbase {
  id: number;
  user_id: string;
  content: string;
  fixed_route_id: number;
  created_at: Date;
}

export default class Feed extends BaseTable<IFeedSupbase> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.FEED);
  }
  async selectFeedAfterId(data?: { id: number; pageNums: number }) {
    try {
      this.validateSupbase();
      let query = this.supabase.from(this.tableName).select(`
        id, 
        content,
        created_at,
        ${Tables.FIXED_ROUTES} ( 
          id, 
          startLocation, 
          endLocation, 
          departureTime, 
          totalSeats,
          availableSeats,
          price,
          created_at 
        ),
        ${Tables.USERS} (*),
        ${Tables.TRIP_REQUESTS} (*)
      `);
      if (data?.id) query = query.lte("created_at", data?.id);

      return query
        .order("created_at", { ascending: false })
        .range(0, data?.pageNums || BaseTable.PAGE_NUMS);
    } catch (e) {
      throw e;
    }
  }
}
