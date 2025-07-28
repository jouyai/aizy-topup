import { createClient } from '@/lib/supabase/server';
import AdminDashboardClient from './AdminDashboardClient';

export type Product = {
  id: string;
  game_id: number;
  name: string;
  price: number;
  sku: string;
  description: string | null;
  created_at: string;
  games: { name: string } | null;
};

export type Game = {
    id: number;
    name: string;
};

const PRODUCTS_PER_PAGE = 10;

async function getInitialData() {
    const supabase = await createClient();
    
    const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`*, games(name)`)
        .order('created_at', { ascending: false })
        .range(0, PRODUCTS_PER_PAGE - 1);

    const { data: games, error: gamesError } = await supabase
        .from('games')
        .select('id, name');

    if (productsError) console.error('Error fetching products:', productsError.message);
    if (gamesError) console.error('Error fetching games:', gamesError.message);
    if (countError) console.error('Error counting products:', countError.message);

    const totalPages = Math.ceil((count ?? 0) / PRODUCTS_PER_PAGE);

    return {
        initialProducts: (products as Product[]) ?? [],
        availableGames: (games as Game[]) ?? [],
        initialTotalPages: totalPages,
    };
}


export default async function AdminDashboardPage() {
  const { initialProducts, availableGames, initialTotalPages } = await getInitialData();
  
  return (
    <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <AdminDashboardClient 
            initialProducts={initialProducts} 
            availableGames={availableGames}
            initialTotalPages={initialTotalPages} 
        />
    </div>
  );
}