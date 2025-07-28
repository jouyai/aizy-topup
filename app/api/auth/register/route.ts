import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  
  try {
    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json({ message: 'Email, password, dan username diperlukan' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      console.error('Supabase sign up error:', error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (data.user && !data.session) {
      return NextResponse.json({ message: 'Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.' }, { status: 201 });
    }

    return NextResponse.json({ message: 'Pendaftaran berhasil!', user: data.user }, { status: 201 });

  } catch (error) {
    console.error('Registration process error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan saat pendaftaran' }, { status: 500 });
  }
}