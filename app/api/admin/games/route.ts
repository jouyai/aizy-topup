import { createClient } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return new NextResponse(JSON.stringify({ message: 'Forbidden' }), { status: 403 });

    try {
        const from = (page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { count, error: countError } = await supabase.from('games').select('*', { count: 'exact', head: true });
        if (countError) throw countError;

        const { data: games, error: gamesError } = await supabase.from('games').select('*').order('name', { ascending: true }).range(from, to);
        if (gamesError) throw gamesError;

        const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);
        return NextResponse.json({ games, totalPages, currentPage: page });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const gameData = await req.json();
        if (!gameData.name || !gameData.slug) {
            return NextResponse.json({ message: 'Nama dan slug game diperlukan' }, { status: 400 });
        }

        const { data: newGame, error } = await supabase
            .from('games')
            .insert({
                name: gameData.name,
                slug: gameData.slug,
                image_url: gameData.image_url,
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') return NextResponse.json({ message: 'Slug sudah ada.' }, { status: 409 });
            throw error;
        }
        return NextResponse.json(newGame, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}