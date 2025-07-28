"use client";

import Link from "next/link";
import Image from "next/image";

export default function GameList({ games }: { games: any[] }) {
  return (
    <section id="pilih-game" className="container mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Pilih Game Favoritmu</h2>
        <p className="text-muted-foreground">
          Pilih game dan mulai top-up diamond, UC, dan credit lainnya.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {games && games.length > 0 ? (
          games.map((game) => (
            <Link
              href={`/topup/${game.slug}`}
              key={game.id}
              className="group relative block w-full aspect-[5/6] overflow-hidden rounded-xl shadow-md"
            >
              <Image
                src={game.image_url || "/placeholder.png"}
                alt={game.name || "Game cover"}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full h-2/5 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white font-bold text-lg leading-tight">
                  {game.name}
                </h3>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            Belum ada game yang tersedia. Silakan tambahkan dari dashboard
            Supabase.
          </p>
        )}
      </div>
    </section>
  );
}
