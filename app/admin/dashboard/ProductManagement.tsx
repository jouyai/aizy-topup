'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Edit, Trash, Search } from 'lucide-react';
import { Product, Game } from './page';
import { Pagination } from '@/components/ui/pagination';
import EditProductModal from './EditProductModal';
import { useDebounce } from 'use-debounce';

type Props = {
    initialProducts: Product[];
    availableGames: Game[];
    initialTotalPages: number;
};

export default function ProductManagement({ initialProducts, availableGames, initialTotalPages }: Props) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [newProduct, setNewProduct] = useState({
        game_id: '',
        name: '',
        price: '',
        sku: '',
        description: '',
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGame, setSelectedGame] = useState('all');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    
    const fetchProducts = useCallback(async (page: number, search: string, gameId: string) => {
        setTableLoading(true);
        setError(null); // Reset error on new fetch
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                search: search,
                game_id: gameId === 'all' ? '' : gameId,
            });
            const response = await fetch(`/api/admin/products?${params.toString()}`);
            if (!response.ok) throw new Error("Gagal memuat produk");
            const data = await response.json();
            setProducts(data.products);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setTableLoading(false);
        }
    }, []);
    
    useEffect(() => {
        fetchProducts(1, debouncedSearchTerm, selectedGame);
    }, [debouncedSearchTerm, selectedGame, fetchProducts]);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages && page !== currentPage) {
            fetchProducts(page, debouncedSearchTerm, selectedGame);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (value: string) => {
        setNewProduct(prev => ({...prev, game_id: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newProduct, price: parseInt(newProduct.price, 10) }),
            });
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Gagal menambahkan produk');
            }
            // Reset filter and search, then fetch page 1
            setSearchTerm('');
            setSelectedGame('all');
            await fetchProducts(1, '', 'all');
            setNewProduct({ game_id: '', name: '', price: '', sku: '', description: ''});
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (productId: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini? Aksi ini tidak bisa dibatalkan.')) return;
        try {
            const response = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Gagal menghapus produk');
            fetchProducts(currentPage, debouncedSearchTerm, selectedGame);
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleSaveProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader><CardTitle>Tambah Produk Baru</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="game_id">Game</Label>
                                    <Select onValueChange={handleSelectChange} value={newProduct.game_id}>
                                        <SelectTrigger><SelectValue placeholder="Pilih game..." /></SelectTrigger>
                                        <SelectContent>
                                            {availableGames.map(game => (
                                                <SelectItem key={game.id} value={game.id.toString()}>{game.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div><Label htmlFor="name">Nama Produk</Label><Input id="name" name="name" value={newProduct.name} onChange={handleInputChange} required /></div>
                                <div><Label htmlFor="sku">Kode Produk (SKU)</Label><Input id="sku" name="sku" value={newProduct.sku} onChange={handleInputChange} required /></div>
                                <div><Label htmlFor="price">Harga</Label><Input id="price" name="price" type="number" value={newProduct.price} onChange={handleInputChange} required /></div>
                                <div><Label htmlFor="description">Deskripsi (Opsional)</Label><Input id="description" name="description" value={newProduct.description} onChange={handleInputChange} /></div>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Tambah Produk
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader><CardTitle>Daftar Produk</CardTitle></CardHeader>
                        <CardContent>
                             <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="relative flex-grow">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Cari nama atau SKU produk..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <Select onValueChange={setSelectedGame} value={selectedGame}>
                                    <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filter game" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Game</SelectItem>
                                        {availableGames.map(game => (<SelectItem key={game.id} value={game.id.toString()}>{game.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="relative min-h-[480px]">
                                {tableLoading && (<div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-md"><Loader2 className="h-8 w-8 animate-spin" /></div>)}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Game</TableHead>
                                            <TableHead>Nama Produk</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead className="text-right">Harga</TableHead>
                                            <TableHead className="text-center">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.length > 0 ? products.map(product => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.games?.name ?? 'N/A'}</TableCell>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                                                <TableCell className="text-right">Rp {product.price.toLocaleString('id-ID')}</TableCell>
                                                <TableCell className="text-center">
                                                    <Button variant="ghost" size="icon" className="mr-2 h-8 w-8" onClick={() => handleEditClick(product)}><Edit className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 h-8 w-8" onClick={() => handleDeleteClick(product.id)}><Trash className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        )) : (<TableRow><TableCell colSpan={5} className="text-center h-24">Produk tidak ditemukan.</TableCell></TableRow>)}
                                    </TableBody>
                                </Table>
                            </div>
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <EditProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} games={availableGames} onSave={handleSaveProduct} />
        </>
    );
}