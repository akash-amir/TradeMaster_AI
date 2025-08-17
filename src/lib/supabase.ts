// Compatibility shim: some parts of the app import from "@/lib/supabase"
// We re-export the existing client from integrations/supabase/client
export { supabase } from '../integrations/supabase/client'
