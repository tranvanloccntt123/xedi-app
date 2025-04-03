import { SupabaseClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import { XediTables } from "./tables";

export const supabase: SupabaseClient =
  Platform.OS === "web"
    ? require("./supabase.web").supabase
    : require("./supabase").supabase;

class XediSupabase {
  tables: XediTables;
  constructor() {
    this.tables = new XediTables(supabase);
  }

  async getUser() {
    return supabase.auth.getUser();
  }
}

export const xediSupabase = new XediSupabase();
