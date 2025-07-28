// file: app/topup/[slug]/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound } from 'next/navigation';
import TopUpClientUI from "./TopUpClientUI";

// Definisikan tipe props di sini
type PageProps = {
  params: { slug: string };
};

async function getGameAndProducts(slug: string) {
  const supabase = await createClient();

  const { data: game, error: gameError } = await supabase
    .from('games')
    .select('*')
    .eq('slug', slug)
    .single();

  if (gameError || !game) {
    return null;
  }

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('game_id', game.id)
    .order('price', { ascending: true });

  if (productsError) {
    console.error("Error fetching products:", productsError.message);
    return { game, products: [] };
  }

  return { game, products };
}

export default async function TopUpPage({ params }: PageProps) {
  const awaitedParams = await params;
  const data = await getGameAndProducts(awaitedParams.slug);

  if (!data) {
    notFound();
  }

  const { game, products } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <TopUpClientUI game={game} products={products} />
    </div>
  );
}