import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

export default class Comment extends BaseTable<IComment> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.COMMENTS);
  }
}
