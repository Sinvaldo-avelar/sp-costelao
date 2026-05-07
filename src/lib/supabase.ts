// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Ele busca as chaves que você colocou no .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cria a ponte de comunicação
export const supabase = createClient(supabaseUrl, supabaseAnonKey)