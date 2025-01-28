import { Platform } from "react-native"

export const supabase = Platform.OS === "web" ? require("./supabase.web").supabase : require("./supabase").supabase

