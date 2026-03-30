import { createClient } from '@supabase/supabase-js'

import { clientEnv, hasSupabaseConfig } from '@/lib/config/env'

export const supabase = hasSupabaseConfig
  ? createClient(clientEnv.supabaseUrl, clientEnv.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    })
  : null
