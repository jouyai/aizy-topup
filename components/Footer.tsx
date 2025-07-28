import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t">
      <div className="container mx-auto py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">Aizy Topup</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Aizy Topup. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/syarat-ketentuan" className="text-sm hover:underline">
            Syarat & Ketentuan
          </Link>
          <Link href="/kebijakan-privasi" className="text-sm hover:underline">
            Kebijakan Privasi
          </Link>
        </div>
      </div>
    </footer>
  );
}