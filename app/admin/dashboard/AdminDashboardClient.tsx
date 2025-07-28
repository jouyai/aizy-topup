'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gamepad2, Package, Users } from 'lucide-react';
import ProductManagement from './ProductManagement';
import GameManagement from './GameManagement';
import { Product, Game } from './page';

type Props = {
    initialProducts: Product[];
    availableGames: Game[];
    initialTotalPages: number;
};

export default function AdminDashboardClient({ initialProducts, availableGames, initialTotalPages }: Props) {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div>
            <div className="mb-6 border-b">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <Button
                        variant={activeTab === 'products' ? 'secondary' : 'ghost'}
                        onClick={() => setActiveTab('products')}
                        className="gap-2"
                    >
                        <Package className="h-4 w-4" />
                        Manajemen Produk
                    </Button>
                    <Button
                        variant={activeTab === 'games' ? 'secondary' : 'ghost'}
                        onClick={() => setActiveTab('games')}
                        className="gap-2"
                    >
                        <Gamepad2 className="h-4 w-4" />
                        Manajemen Game
                    </Button>
                </nav>
            </div>

            <div>
                {activeTab === 'products' && (
                    <ProductManagement
                        initialProducts={initialProducts}
                        availableGames={availableGames}
                        initialTotalPages={initialTotalPages}
                    />
                )}
                {activeTab === 'games' && <GameManagement />}
            </div>
        </div>
    );
}