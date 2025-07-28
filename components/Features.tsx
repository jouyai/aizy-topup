"use client";

import { Zap, BadgePercent, ShieldCheck, Rocket } from "lucide-react";

const features = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Proses Instan",
    description: "Pembayaran terverifikasi otomatis, top-up langsung masuk.",
  },
  {
    icon: <BadgePercent className="h-8 w-8 text-primary" />,
    title: "Harga Terbaik",
    description: "Kami menawarkan harga paling kompetitif untuk semua game.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Aman & Terpercaya",
    description: "Transaksi aman dengan berbagai metode pembayaran terverifikasi.",
  },
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: "Layanan Cepat",
    description: "Dukungan pelanggan yang siap membantu Anda kapan saja.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="container mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Kenapa Memilih Aizy Topup?</h2>
        <p className="text-muted-foreground">
          Kami memberikan pengalaman top-up terbaik untuk para gamers.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center flex flex-col items-center">
            {feature.icon}
            <h3 className="text-xl font-bold mt-4 mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
