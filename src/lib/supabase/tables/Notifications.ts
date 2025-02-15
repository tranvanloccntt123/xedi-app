import { Tables } from "@/src/constants";
import { INotification } from "@/src/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

export default class Notifications extends BaseTable<INotification> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.NOTIFICATIONS);
  }
}

