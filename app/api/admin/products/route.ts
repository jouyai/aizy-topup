import { createClient } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

const PRODUCTS_PER_PAGE = 10;

// Fungsi untuk MENGAMBIL (GET) produk dengan paginasi, search, dan filter
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);

    // Ambil parameter dari URL
    const page = parseInt(searchParams.get('page') || '1', 10);
    const searchQuery = searchParams.get('search') || '';
    const gameId = searchParams.get('game_id') || '';

    // 1. Validasi Sesi dan Peran Admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
    
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) {
        return new NextResponse(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
    }

    // Logika untuk mengambil data
    try {
        const from = (page - 1) * PRODUCTS_PER_PAGE;
        const to = from + PRODUCTS_PER_PAGE - 1;

        // Bangun query dasar
        let query = supabase
            .from('products')
            .select(`*, games(name)`, { count: 'exact' });

        // Terapkan filter PENCARIAN jika ada
        if (searchQuery) {
            // Mencari di kolom 'name' ATAU 'sku' (case-insensitive)
            query = query.or(`name.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`);
        }

        // Terapkan filter GAME jika ada
        if (gameId && gameId !== 'all') {
            query = query.eq('game_id', gameId);
        }

        // Eksekusi query dengan paginasi dan urutan
        const { data: products, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        const totalPages = Math.ceil((count ?? 0) / PRODUCTS_PER_PAGE);

        // Kembalikan data dalam format JSON
        return NextResponse.json({ products, totalPages, currentPage: page });

    } catch (error: any) {
        console.error('Error fetching products:', error);
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}


// Fungsi untuk MENAMBAH (POST) produk baru
export async function POST(req: Request) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    if (!profile?.is_admin) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const productData = await req.json();

        if (!productData.game_id || !productData.name || !productData.price || !productData.sku) {
            return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
        }

        const { data: newProduct, error } = await supabase
            .from('products')
            .insert({
                game_id: productData.game_id,
                name: productData.name,
                price: productData.price,
                sku: productData.sku,
                description: productData.description,
            })
            .select('*, games(name)')
            .single();

        if (error) {
            if (error.code === '23505') { // Kode error postgres untuk unique violation
                 return NextResponse.json({ message: 'SKU produk sudah ada.' }, { status: 409 });
            }
            throw error;
        }

        return NextResponse.json(newProduct, { status: 201 });

    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}