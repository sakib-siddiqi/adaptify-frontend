import { createClient } from "@supabase/supabase-js";

export default createClient(import.meta.env.VITE_SUPABASE_URL as string,import.meta.env.VITE_SUPABASE_KEY as string);