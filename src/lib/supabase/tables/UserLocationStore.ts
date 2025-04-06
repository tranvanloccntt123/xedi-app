import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

export default class UserLocationStore extends BaseTable<
  IUserLocationStore,
  IUserLocationStoreSource
> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.USER_LOCATION_STORE);
  }
}
