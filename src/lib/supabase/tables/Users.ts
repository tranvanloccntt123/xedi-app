import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

export default class Users extends BaseTable<IUser> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.USERS);
  }
  async signUp(data: IUser) {
    return this.add([data]);
  }
  async updateUser(id: string, data: IUser) {
    return this.updateById(id, data);
  }
  async info() {
    try {
      this.validateSupbase();
      const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
      if (!userId) throw "User is empty";
      return this.supabase.from(this.tableName).select("*").eq("id", userId);
    } catch (e) {
      throw e;
    }
  }
  async updateLocation(lat: number, lon: number) {
    try {
      this.validateSupbase();
      const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
      if (!userId) throw "User is empty";
      return this.supabase
        .from(this.tableName)
        .update({ lat, lon })
        .eq("id", userId)
        .select();
    } catch (e) {
      throw e;
    }
  }
}
