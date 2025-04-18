import { Tables } from "@/src/constants";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseTable } from "./BaseTable";

export default class FixedRouteOrders extends BaseTable<IFixedRouteOrder> {
  constructor(_supabase: SupabaseClient) {
    super(_supabase, Tables.FIXED_ROUTE_ORDERS);
  }
  async acceptFixedRouteOrder(id: string) {
    const { data, error } = await this.supabase.functions.invoke(
      "driver-accept-fixed-route-request",
      {
        body: JSON.stringify({ id }),
      }
    );
    return { data, error };
  }
  async selectOrderByStatus(fixed_route_id: any, userId?: string) {
    try {
      this.validateSupbase();
      let query = this.supabase
        .from(this.tableName)
        .select(`*, ${Tables.USERS}(*)`)
        .order("user_id", { ascending: true })
        .eq("fixed_route_id", fixed_route_id);
      if (userId) {
        query = query.eq("user_id", userId);
      }
      return query;
    } catch (e) {
      throw e;
    }
  }
}
