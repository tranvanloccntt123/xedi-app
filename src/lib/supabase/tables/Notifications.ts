import { Tables } from "@/src/constants";
import { INotification, SupabaseTableFilter, SupabaseParams } from "@/src/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

export default class Notifications extends BaseTable<INotification> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.NOTIFICATIONS);
  }
  async selectByUserIdAfterId(
    data?: SupabaseParams
  ): Promise<SupabaseTableFilter<INotification>> {
    try {
      this.validateSupbase();
      const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
      if (!userId) throw "User is empty";
      let query = this.supabase
        .from(this.tableName)
        .select((data.select || "*") as "*");
      if (data?.id) query = query.gte("id", data?.id);

      return query
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(0, data?.pageNums || BaseTable.PAGE_NUMS);
    } catch (e) {
      throw e;
    }
  }
}
