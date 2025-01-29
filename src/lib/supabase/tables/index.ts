import { SupabaseClient } from "@supabase/supabase-js";
import FixedRoutes from "./FixedRoutes";

export class XediTables {
    fixedRoutes: FixedRoutes;
    constructor (supabase: SupabaseClient) {
        this.fixedRoutes = new FixedRoutes(supabase);
    }
}

