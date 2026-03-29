import { z } from 'zod'

const clientEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().trim().default(''),
  VITE_SUPABASE_ANON_KEY: z.string().trim().default(''),
  VITE_TURNSTILE_SITE_KEY: z.string().trim().default(''),
})

const parsedEnv = clientEnvSchema.safeParse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ?? '',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  VITE_TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '',
})

const fallbackEnv = {
  VITE_SUPABASE_URL: '',
  VITE_SUPABASE_ANON_KEY: '',
  VITE_TURNSTILE_SITE_KEY: '',
}

const rawEnv = parsedEnv.success ? parsedEnv.data : fallbackEnv

export const clientEnv = {
  supabaseUrl: rawEnv.VITE_SUPABASE_URL,
  supabaseAnonKey: rawEnv.VITE_SUPABASE_ANON_KEY,
  turnstileSiteKey: rawEnv.VITE_TURNSTILE_SITE_KEY,
}

export const hasSupabaseConfig =
  clientEnv.supabaseUrl.length > 0 && clientEnv.supabaseAnonKey.length > 0
