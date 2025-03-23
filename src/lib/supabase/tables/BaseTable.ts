import {
  SupabaseParams,
  SupabaseTableFilter,
  SupabaseTableInsert,
} from "@/src/types";
import { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";

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

  getQuery(data?: SupabaseParams) {
    let query = this.supabase
      .from(this.tableName)
      .select((data?.select || "*") as "*");

    if (data?.filter) {
      data.filter.forEach((raw) => {
        switch (raw.filter) {
          case "lte":
            query = query.lte(raw.filed, raw.data);
            break;
          case "lt":
            query = query.lt(raw.filed, raw.data);
            break;
          case "gte":
            query = query.gte(raw.filed, raw.data);
            break;
          case "gt":
            query = query.gt(raw.filed, raw.data);
            break;
          case "eq":
            query = query.eq(raw.filed, raw.data);
            break;
          default:
            break;
        }
      });
    }

    if (data?.orFilter) {
      data.orFilter.forEach((raw) => {
        query = query.or(raw.query);
      });
    }

    return query;
  }

  async selectByUserIdBeforeDate(
    data?: SupabaseParams
  ): Promise<PostgrestSingleResponse<Data[]>> {
    try {
      this.validateSupbase();
      let query = this.getQuery({
        ...(data || {}),
        byCurrentUser: true,
      });

      if (data?.date) query = query.lt("created_at", data?.date);

      if (data?.byCurrentUser) {
        const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
        if (!userId) throw "User is empty";
        query = query.eq("user_id", userId);
      }

      return query
        .order("created_at", { ascending: false })
        .range(0, data?.pageNums || BaseTable.PAGE_NUMS);
    } catch (e) {
      throw e;
    }
  }

  async selectByUserIdAfterDate(
    data?: SupabaseParams
  ): Promise<PostgrestSingleResponse<Data[]>> {
    try {
      this.validateSupbase();
      let query = this.getQuery({
        ...(data || {}),
        byCurrentUser: true,
      });

      if (data?.date) query = query.gt("created_at", data?.date);

      if (data?.byCurrentUser) {
        const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
        if (!userId) throw "User is empty";
        query = query.eq("user_id", userId);
      }

      return query
        .order("created_at", { ascending: true })
        .range(0, data?.pageNums || BaseTable.PAGE_NUMS);
    } catch (e) {
      throw e;
    }
  }

  async selectByUserIdAfterId(
    data?: SupabaseParams
  ): Promise<SupabaseTableFilter<Data>> {
    try {
      this.validateSupbase();
      const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
      if (!userId) throw "User is empty";

      let query = this.getQuery({
        ...(data || {}),
        byCurrentUser: true,
      });

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
    data?: SupabaseParams
  ): Promise<SupabaseTableFilter<Data>> {
    try {
      this.validateSupbase();

      let query = this.getQuery({
        ...(data || {}),
        byCurrentUser: true,
      });

      if (data?.id) query = query.gt("id", data?.id);

      return query
        .order("id", { ascending: true })
        .range(0, data?.pageNums || BaseTable.PAGE_NUMS);
    } catch (e) {
      throw e;
    }
  }

  async selectById(
    id: any,
    params?: {
      query?: string;
    }
  ): Promise<SupabaseTableInsert<Data>> {
    try {
      this.validateSupbase();
      return this.supabase
        .from(this.tableName)
        .select(params?.query || "*")
        .eq("id", id) as any;
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
