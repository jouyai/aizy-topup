'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNav } from "./MobileNav";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/promo", label: "Promo" },
  { href: "/lacak-pesanan", label: "Lacak Pesanan" },
  { href: "/hubungi-kami", label: "Hubungi Kami" },
];

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      router.refresh();
    });

    return () => authListener.subscription.unsubscribe();
  }, [supabase.auth, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Kiri: Logo & Navigasi */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-semibold text-lg tracking-tight">Aizy Topup</span>
          </Link>

          <nav className="hidden lg:flex gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm px-3 py-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Tengah: Search */}
        <div className="hidden md:flex relative w-1/3 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari game favoritmu..."
            className="pl-9 bg-gray-800/50 border border-white/10 rounded-full text-sm"
          />
        </div>

        {/* Kanan: Auth & MobileNav */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            {!loading && (
              user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/admin/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Masuk</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Daftar</Link>
                  </Button>
                </>
              )
            )}
          </div>

          {/* Mobile Menu */}
          <MobileNav user={user} onLogout={handleLogout} loading={loading} />
        </div>
      </div>
    </header>
  );
}
