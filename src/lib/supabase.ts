// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

// Ele busca as chaves que você colocou no .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cria a ponte de comunicação usando cookies integrados com o Next.js
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)