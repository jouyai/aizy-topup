"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

export default function Hero() {
  <TypewriterEffect
    words={[
      { text: "Topup", className: "text-primary font-bold" },
      { text: "Game", className: "text-blue-500 font-semibold" },
      { text: "Murah!", className: "text-green-400 font-bold" },
    ]}
  />;

  return (
    <section className="w-full min-h-[80vh] flex flex-col justify-center items-center px-6 text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
        Selamat datang di <span className="text-primary">Aizy Topup</span>
      </h1>

      <div className="h-16 mb-6">
        <TypewriterEffect words={words} />
      </div>

      <p className="text-muted-foreground max-w-xl mb-6">
        Nikmati layanan top up game tercepat dan termurah di Indonesia. Support
        Mobile Legends, Valorant, Genshin Impact, dan banyak lagi!
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/topup">
          <Button size="lg" className="rounded-xl text-base">
            Topup Sekarang
          </Button>
        </Link>
        <Link href="/produk">
          <Button variant="outline" size="lg" className="rounded-xl text-base">
            Lihat Produk
          </Button>
        </Link>
      </div>
    </section>
  );
}
