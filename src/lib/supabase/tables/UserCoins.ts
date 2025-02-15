import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";
import { IUserCoin } from "@/src/types";

export default class UserCoins extends BaseTable<IUserCoin> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.USER_COINS);
  }
  async getCoins() {
    try {
      this.validateSupbase();
      const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
      if (!userId) throw "User is empty";
      let query = this.supabase
        .from(this.tableName)
        .select("*")
        .eq("user_id", userId)
        .single();

      return query;
    } catch (e) {
      throw e;
    }
  }
}
