// lib/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
// This needs to be 'next/headers' not 'next/header'
import { cookies } from 'next/headers'

// Make the function async to use await
export async function createClient() { 
  // Await the cookies() function to get the actual cookie store
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}