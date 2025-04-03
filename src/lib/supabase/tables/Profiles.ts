import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

type IProfilesFCM = {
  id: string;
  fcm_token: string;
};

export default class Profiles extends BaseTable<IProfilesFCM> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.PROFILES);
  }
}
