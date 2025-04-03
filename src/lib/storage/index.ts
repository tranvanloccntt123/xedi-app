import { Platform } from "react-native"

const storage = Platform.OS === "web" ? require("./storage.web").supabase : require("./storage").supabase

export default storage;
