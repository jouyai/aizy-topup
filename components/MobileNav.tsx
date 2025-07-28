'use client';

import Link from 'next/link';
import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { type User } from '@supabase/supabase-js';

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/promo", label: "Promo" },
  { href: "/lacak-pesanan", label: "Lacak Pesanan" },
  { href: "/hubungi-kami", label: "Hubungi Kami" },
];

type MobileNavProps = {
  user: User | null;
  onLogout: () => void;
  loading: boolean;
};

export function MobileNav({ user, onLogout, loading }: MobileNavProps) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Buka Menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="flex flex-col p-6">
          <SheetHeader>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">Aizy Topup</span>
            </div>
          </SheetHeader>

          {/* Search bar */}
          <div className="relative mt-6 mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari game favorit..."
              className="pl-9 bg-gray-800/50 border border-white/10 rounded-full"
            />
          </div>

          {/* Nav links */}
          <nav className="grid gap-2 mb-6">
            {navLinks.map((link) => (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-md px-4 py-2 text-base font-medium hover:bg-accent"
                >
                  {link.label}
                </Link>
              </SheetClose>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="mt-auto border-t pt-4">
            {!loading && (
              user ? (
                <div className="flex flex-col gap-3">
                  <SheetClose asChild>
                    <Button asChild className="w-full">
                      <Link href="/admin/dashboard">Dashboard</Link>
                    </Button>
                  </SheetClose>
                  <Button variant="outline" className="w-full" onClick={onLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <SheetClose asChild>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">Masuk</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild className="w-full">
                      <Link href="/register">Daftar</Link>
                    </Button>
                  </SheetClose>
                </div>
              )
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
