import { SupabaseClient } from "@supabase/supabase-js";

type SupabaseTableFilter<T = any> = {
  data: Array<T>;
  status: number;
  statusText: string;
};

type SupabaseTableInsert<T = any> = {
  data: Array<T>;
  error: any;
};

export class BaseTable<Data = any, Source = any> {
  supabase: SupabaseClient;
  tableName: string;
  constructor(_supabase: SupabaseClient, _tableName: string) {
    this.supabase = _supabase;
    this.tableName = _tableName;
  }

  async selectByUserIdAfterId(
    id?: number,
    _pageNums: number = 25
  ): Promise<SupabaseTableFilter<Data>> {
    if (!this.supabase) throw "Supabase is not initialy";
    if (!this.tableName) throw "Table not found";
    const userId = (await this.supabase.auth.getUser())?.data?.user?.id;
    if (!userId) throw "User is empty";
    if (id)
      return this.supabase
        .from(this.tableName)
        .select("*")
        .gte("id", id)
        .eq("user_id", userId)
        .order("id", { ascending: true })
        .range(0, _pageNums);

    return this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: true })
      .range(0, _pageNums);
  }

  async selectAfterId(
    id?: number,
    _pageNums: number = 25
  ): Promise<SupabaseTableFilter<Data>> {
    if (!this.supabase) throw "Supabase is not initialy";
    if (!this.tableName) throw "Table not found";
    if (id)
      return this.supabase
        .from(this.tableName)
        .select("*")
        .gte("id", id)
        .order("id", { ascending: true })
        .range(0, _pageNums);

    return this.supabase
      .from(this.tableName)
      .select("*")
      .order("id", { ascending: true })
      .range(0, _pageNums);
  }
  async add(data: Array<Source>): Promise<SupabaseTableInsert<Data>> {
    if (!this.supabase) throw "Supabase is not initialy";
    if (!this.tableName) throw "Table not found";
    return this.supabase.from(this.tableName).insert(data).select();
  }
}
