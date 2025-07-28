'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Product, Game } from './page';

interface EditProductModalProps {
    product: Product | null;
    games: Game[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedProduct: Product) => void;
}

export default function EditProductModal({ product, games, isOpen, onClose, onSave }: EditProductModalProps) {
    const [editedProduct, setEditedProduct] = useState<Partial<Product> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setEditedProduct(product);
    }, [product]);

    if (!isOpen || !editedProduct) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (value: string) => {
        setEditedProduct(prev => ({ ...prev, game_id: parseInt(value, 10) }));
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/admin/products/${editedProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...editedProduct,
                    price: parseInt(editedProduct.price as any, 10),
                }),
            });
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Gagal menyimpan perubahan');
            }
            const updatedData = await response.json();
            onSave(updatedData);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Produk: {product?.name}</DialogTitle>
                    <DialogDescription className="sr-only">
                        Formulir untuk memperbarui detail produk. Ubah informasi yang diperlukan dan klik simpan.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="game_id">Game</Label>
                        <Select onValueChange={handleSelectChange} defaultValue={editedProduct.game_id?.toString()}>
                            <SelectTrigger><SelectValue placeholder="Pilih game..." /></SelectTrigger>
                            <SelectContent>
                                {games.map(game => (
                                    <SelectItem key={game.id} value={game.id.toString()}>{game.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="name">Nama Produk</Label>
                        <Input id="name" name="name" value={editedProduct.name || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="sku">Kode Produk (SKU)</Label>
                        <Input id="sku" name="sku" value={editedProduct.sku || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="price">Harga</Label>
                        <Input id="price" name="price" type="number" value={editedProduct.price || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="description">Deskripsi (Opsional)</Label>
                        <Input id="description" name="description" value={editedProduct.description || ''} onChange={handleInputChange} />
                    </div>
                </div>
                <DialogFooter>
                    {error && <p className="text-sm text-red-500 mr-auto">{error}</p>}
                    <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
                    <Button onClick={handleSaveChanges} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Simpan Perubahan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}