import {
  SupbaseParams,
  SupabaseTableFilter,
  SupabaseTableInsert,
} from "@/src/types";
import { SupabaseClient } from "@supabase/supabase-js";

export class BaseTable<Data = any, Source = any> {
  supabase: SupabaseClient;
  tableName: string;
  static PAGE_NUMS = 25;
  constructor(_supabase: SupabaseClient, _tableName: string) {
    this.supabase = _supabase;
    this.tableName = _tableName;
  }

  validateSupbase() {
    if (!this.supabase) throw "Supabase is not initialy";
    if (!this.tableName) throw "Table not found";
    return true;
  }

  async selectByUserIdBeforeDate(data?: SupbaseParams) {
    try {
      this.validateSupbase();
      const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
      if (!userId) throw "User is empty";
      let query = this.supabase
        .from(this.tableName)
        .select((data?.select || "*") as "*");
      if (data?.date) query = query.lt("created_at", data?.date);

      return query
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(0, data?.pageNums || BaseTable.PAGE_NUMS);
    } catch (e) {
      throw e;
    }
  }

  async selectByUserIdAfterId(
    data?: SupbaseParams
  ): Promise<SupabaseTableFilter<Data>> {
    try {
      this.validateSupbase();
      const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
      if (!userId) throw "User is empty";
      let query = this.supabase
        .from(this.tableName)
        .select((data?.select || "*") as "*");
      if (data?.id) query = query.gt("id", data?.id);

      return query
        .eq("user_id", userId)
        .order("id", { ascending: true })
        .range(0, data?.pageNums || BaseTable.PAGE_NUMS);
    } catch (e) {
      throw e;
    }
  }

  async selectAfterId(
    data?: SupbaseParams
  ): Promise<SupabaseTableFilter<Data>> {
    try {
      this.validateSupbase();
      let query = this.supabase.from(this.tableName).select("*");
      if (data?.id) query = query.gt("id", data?.id);

      return query
        .order("id", { ascending: true })
        .range(0, data?.pageNums || BaseTable.PAGE_NUMS);
    } catch (e) {
      throw e;
    }
  }

  async selectById(id: any) {
    try {
      this.validateSupbase();
      return this.supabase.from(this.tableName).select("*").eq("id", id);
    } catch (e) {
      throw e;
    }
  }

  async add(data: Array<Source>): Promise<SupabaseTableInsert<Data>> {
    try {
      this.validateSupbase();
      return this.supabase.from(this.tableName).insert(data).select();
    } catch (e) {
      throw e;
    }
  }

  async addWithUserId(data: Array<Source>): Promise<SupabaseTableInsert<Data>> {
    try {
      this.validateSupbase();
      const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
      if (!userId) throw "User is empty";
      return this.supabase
        .from(this.tableName)
        .insert(data.map((v) => ({ ...v, user_id: userId })))
        .select();
    } catch (e) {
      throw e;
    }
  }

  async update(data: Source) {
    try {
      this.validateSupbase();
      return this.supabase.from(this.tableName).update(data).select();
    } catch (e) {
      throw e;
    }
  }

  async updateByUserId(data: Source) {
    try {
      this.validateSupbase();
      const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
      if (!userId) throw "User is empty";
      return this.supabase
        .from(this.tableName)
        .update(data)
        .eq("user_id", userId)
        .select();
    } catch (e) {
      throw e;
    }
  }

  async updateById(id: any, data: Source) {
    try {
      this.validateSupbase();
      return this.supabase
        .from(this.tableName)
        .update(data)
        .eq("id", id)
        .select();
    } catch (e) {
      throw e;
    }
  }

  async deleteById(id: any) {
    try {
      this.validateSupbase();
      return this.supabase.from(this.tableName).delete().eq("id", id);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteByField(field: string, data: any) {
    try {
      this.validateSupbase();
      return this.supabase.from(this.tableName).delete().eq(field, data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
