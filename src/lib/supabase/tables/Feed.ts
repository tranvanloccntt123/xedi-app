import { Tables } from "@/src/constants";
import { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

export default class Feed extends BaseTable<INewsFeedItem> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.FEED);
  }
  async selectFeedAfterId(data?: {
    date?: string;
    pageNums?: number;
  }): Promise<PostgrestSingleResponse<INewsFeedItem[]>> {
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
        ${Tables.TRIP_REQUESTS} (*),
        ${Tables.COMMENTS} (count)
      `);
      if (data?.date) query = query.lt("created_at", data?.date);

      return query
        .order("created_at", { ascending: false })
        .range(0, data?.pageNums || BaseTable.PAGE_NUMS) as any;
    } catch (e) {
      throw e;
    }
  }
}
