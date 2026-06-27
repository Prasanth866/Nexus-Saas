import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
        "CRITICAL: Missing Supabase environment configuration. Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
}

export const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        persistSession: false
    },
});

export const BUCKET_NAME = process.env.BUCKET_NAME;