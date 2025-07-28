'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';

type Game = {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
};

export default function GameManagement() {
    const [games, setGames] = useState<Game[]>([]);
    const [newGame, setNewGame] = useState({ name: '', slug: '', image_url: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const fetchGames = async (page: number) => {
        setTableLoading(true);
        try {
            const response = await fetch(`/api/admin/games?page=${page}`);
            if (!response.ok) throw new Error("Gagal memuat daftar game");
            const data = await response.json();
            setGames(data.games);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setTableLoading(false);
        }
    };
    
    useEffect(() => {
        fetchGames(1);
    }, []);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages && page !== currentPage) {
            fetchGames(page);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'name') {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            setNewGame(prev => ({ ...prev, name: value, slug }));
        } else {
             setNewGame(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/admin/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGame),
            });
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Gagal menambahkan game');
            }
            await fetchGames(1);
            setNewGame({ name: '', slug: '', image_url: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader><CardTitle>Tambah Game Baru</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nama Game</Label>
                                <Input id="name" name="name" value={newGame.name} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input id="slug" name="slug" value={newGame.slug} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="image_url">URL Gambar (Opsional)</Label>
                                <Input id="image_url" name="image_url" value={newGame.image_url} onChange={handleInputChange} />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Tambah Game
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <Card>
                    <CardHeader><CardTitle>Daftar Game</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative min-h-[300px]">
                            {tableLoading && (
                                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-md">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            )}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Game</TableHead>
                                        <TableHead>Slug</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {games.length > 0 ? games.map(game => (
                                        <TableRow key={game.id}>
                                            <TableCell className="font-medium">{game.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{game.slug}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center h-24">Belum ada game.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}