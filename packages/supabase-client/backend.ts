import { SupabaseClient } from "@supabase/supabase-js";
import { XediTables } from "./tables";

export const supabase: SupabaseClient = require("./supabase.web").supabase

class XediSupabase {
  tables: XediTables;
  constructor() {
    this.tables = new XediTables(supabase);
  }

  async getUser() {
    return supabase.auth.getUser();
  }

  getBucket(bucket?: "popular" | "profile") {
    return supabase.storage.from(bucket || "popular");
  }
}

export const xediSupabase = new XediSupabase();
