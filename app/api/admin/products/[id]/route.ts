import { createClient } from '@/lib/supabase/server';
import { NextResponse, NextRequest } from 'next/server';

// Fungsi untuk UPDATE produk berdasarkan ID
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    
    const { id } = await params;

    // Validasi admin (keamanan)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return new NextResponse(JSON.stringify({ message: 'Forbidden' }), { status: 403 });

    try {
        const productData = await req.json();
        
        const { data: updatedProduct, error } = await supabase
            .from('products')
            .update({
                name: productData.name,
                price: productData.price,
                sku: productData.sku,
                description: productData.description,
                game_id: productData.game_id
            })
            .eq('id', id)
            .select('*, games(name)')
            .single();

        if (error) {
            console.error('Supabase update error:', error);
            throw error;
        };
        
        return NextResponse.json(updatedProduct);

    } catch (error: any) {
        console.error('Error updating product:', error);
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

// Fungsi untuk DELETE produk berdasarkan ID
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    
    const { id } = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return new NextResponse(JSON.stringify({ message: 'Forbidden' }), { status: 403 });

    try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            console.error('Supabase delete error:', error);
            throw error;
        };
        
        return new NextResponse(null, { status: 204 }); // 204 No Content, artinya sukses
        
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}