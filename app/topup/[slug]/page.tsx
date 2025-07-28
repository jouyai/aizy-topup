import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TopUpClientUI from "./TopUpClientUI";

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TopUpPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }
  
  const supabase = await createClient();

  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .single();

  if (gameError || !game) {
    console.error("Game not found or Supabase error:", gameError);
    notFound();
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("game_id", game.id)
    .order("price", { ascending: true });

  if (productsError) {
    console.error("Error fetching products:", productsError.message);
    return (
      <div className="container mx-auto px-4 py-8">
        <TopUpClientUI game={game} products={[]} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TopUpClientUI game={game} products={products || []} />
    </div>
  );
}