import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Fungsi ini HARUS async
export async function createClient() { 
  // Anda HARUS menggunakan 'await' di sini untuk mendapatkan cookie store
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
            // Ini bisa diabaikan jika Anda memiliki middleware yang me-refresh sesi pengguna.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Ini bisa diabaikan jika Anda memiliki middleware yang me-refresh sesi pengguna.
          }
        },
      },
    }
  )
}