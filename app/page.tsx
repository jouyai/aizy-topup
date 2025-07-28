import { createClient } from "@/lib/supabase/server";
import GameList from "@/components/GameList"; // Komponen Client
import HeroSection from "@/components/Hero";
import FeaturesSection from "@/components/Features";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: games, error } = await supabase
    .from("games")
    .select("id, name, slug, image_url")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching games:", error.message);
  }

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <HeroSection />
      <GameList games={games || []} />
      <FeaturesSection />
    </div>
  );
}
