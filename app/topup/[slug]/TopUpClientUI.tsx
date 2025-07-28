'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Gamepad2, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Game = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
};

type Product = {
  id: string;
  game_id: number;
  name: string;
  description: string | null;
  price: number;
  sku: string; 
};

type TopUpClientUIProps = {
  game: Game;
  products: Product[];
};

export default function TopUpClientUI({ game, products }: TopUpClientUIProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');

  const [validationStatus, setValidationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [username, setUsername] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleValidate = async () => {
    if (!userId) {
      setErrorMessage('User ID tidak boleh kosong.');
      setValidationStatus('error');
      return;
    }
    
    setUsername(null);
    setErrorMessage(null);
    setValidationStatus('loading');

    try {
      const response = await fetch('/api/validate-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: game.slug, userId, zoneId }),
      });

      const result = await response.json();

      if (result.success) {
        setUsername(result.username);
        setValidationStatus('success');
      } else {
        setErrorMessage(result.message || 'User tidak ditemukan.');
        setValidationStatus('error');
      }
    } catch (error) {
      setErrorMessage('Gagal terhubung ke server validasi.');
      setValidationStatus('error');
    }
  };

  const handlePayNow = () => {
    console.log({
      userId,
      zoneId,
      username,
      product: selectedProduct,
      payment: selectedPayment,
    });
    alert('Logika untuk pembayaran akan diimplementasikan di sini.');
  };
  
  const isPayButtonDisabled = validationStatus !== 'success' || !selectedProduct || !selectedPayment;

  // URL Ikon Diamond (pilih salah satu dari yang Anda berikan)
  const diamondIconUrl = "https://cdn.bangjeff.com/c899cd64-bfde-430f-ad34-8f28ae241558.png";

  return (
    <>
      <Card className="mb-8">
        <CardContent className="flex items-center p-6">
          {game.image_url ? (
            <Image
              src={game.image_url}
              alt={game.name}
              width={80}
              height={80}
              className="w-20 h-20 mr-6 rounded-lg object-cover"
            />
          ) : (
            <div className="w-20 h-20 mr-6 flex items-center justify-center bg-muted rounded-lg">
              <Gamepad2 className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{game.name}</h1>
            <p className="text-muted-foreground">Top up {game.name} dengan mudah dan cepat!</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
            <Card>
                <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">1. Masukkan Detail Akun</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                    type="text"
                    placeholder="User ID"
                    className="flex-grow p-3 border border-gray-600 rounded-md bg-gray-800 text-white placeholder:text-gray-400 w-full focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    value={userId}
                    onChange={(e) => { setUserId(e.target.value); setValidationStatus('idle'); setUsername(null); }}
                    />
                    {game.slug.includes('mobile-legends') && (
                    <input
                        type="text"
                        placeholder="Zone ID"
                        className="p-3 border border-gray-600 rounded-md bg-gray-800 text-white placeholder:text-gray-400 w-full sm:w-1/3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        value={zoneId}
                        onChange={(e) => { setZoneId(e.target.value); setValidationStatus('idle'); setUsername(null); }}
                    />
                    )}
                    <Button onClick={handleValidate} disabled={validationStatus === 'loading'} className="w-full sm:w-auto">
                        {validationStatus === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Cek ID
                    </Button>
                </div>
                {validationStatus === 'success' && username && (
                    <div className="mt-4 flex items-center text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 p-3 rounded-md">
                        <CheckCircle className="mr-2 h-5 w-5"/>
                        <p>Nickname: <span className="font-bold">{username}</span></p>
                    </div>
                )}
                {validationStatus === 'error' && errorMessage && (
                    <div className="mt-4 flex items-center text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-md">
                        <XCircle className="mr-2 h-5 w-5"/>
                        <p>{errorMessage}</p>
                    </div>
                )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">2. Pilih Nominal</h2>
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => setSelectedProduct(product)}
                          className={`p-4 border rounded-lg hover:border-blue-500 transition-all duration-300 flex items-center gap-3 ${selectedProduct?.id === product.id ? 'border-blue-500 ring-2 ring-blue-500 bg-gray-700' : 'border-gray-600 bg-gray-800 hover:bg-gray-700'}`}
                        >
                          <Image
                            src={diamondIconUrl}
                            alt="Diamond Icon"
                            width={28}
                            height={28}
                            className="w-7 h-7 flex-shrink-0"
                          />
                          <div className="text-left">
                            <div className="font-semibold text-sm leading-tight">{product.name}</div>
                            <div className="mt-1 text-primary font-bold text-sm">
                              Rp {product.price.toLocaleString('id-ID')}
                            </div>
                          </div>
                        </button>
                    ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">Produk untuk game ini belum tersedia.</p>
                )}
                </CardContent>
            </Card>
            
           <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">3. Pilih Metode Pembayaran</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 <button
                    onClick={() => setSelectedPayment('QRIS')}
                    className={`p-4 border rounded-lg hover:border-blue-500 transition-all duration-300 flex items-center justify-center ${selectedPayment === 'QRIS' ? 'border-blue-500 ring-2 ring-blue-500 bg-gray-700' : 'border-gray-600 bg-gray-800 hover:bg-gray-700'}`}
                  >
                    <p className="font-semibold">QRIS</p>
                  </button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
            <Card className="sticky top-24">
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-4">Ringkasan Pesanan</h2>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Nickname:</span>
                            <span className="font-semibold">{username || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Item:</span>
                            <span className="font-semibold text-right">{selectedProduct?.name || '-'}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Pembayaran:</span>
                            <span className="font-semibold">{selectedPayment || '-'}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-gray-600 pt-4">
                            <span>Total Bayar:</span>
                            <span>Rp {selectedProduct ? selectedProduct.price.toLocaleString('id-ID') : '0'}</span>
                        </div>
                    </div>
                    <Button onClick={handlePayNow} className="w-full mt-6" size="lg" disabled={isPayButtonDisabled}>
                        Bayar Sekarang
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}