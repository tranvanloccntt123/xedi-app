import { Tables } from "@/src/constants";
import { IFixedRouteOrder } from "@/src/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

export default class FixedRouteOrders extends BaseTable<IFixedRouteOrder> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.FIXED_ROUTE_ORDERS);
  }
}
