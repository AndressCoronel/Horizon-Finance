"use client";

import { useState } from "react";
import { useMarketData } from "@/hooks/use-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Search,
    ArrowUpRight,
    ArrowDownRight,
    Globe,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { formatCurrency, formatPercentage, formatCompactNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function MarketPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { data: coins, isLoading } = useMarketData(page);

    const filtered = coins?.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.symbol.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Globe className="h-7 w-7 text-primary" />
                    Market Explorer
                </h1>
                <p className="text-muted-foreground mt-1">
                    Precios de criptomonedas en tiempo real
                </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar criptomoneda..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-profit live-pulse" />
                Actualizando cada 60 segundos
            </div>

            {/* Market Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left text-xs font-medium text-muted-foreground p-4 w-12">
                                        #
                                    </th>
                                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                                        Activo
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground p-4">
                                        Precio
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground p-4">
                                        24h %
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground p-4 hidden sm:table-cell">
                                        7d %
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground p-4 hidden md:table-cell">
                                        Market Cap
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell">
                                        Volumen 24h
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground p-4">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading
                                    ? Array.from({ length: 10 }).map((_, i) => (
                                        <tr key={i} className="border-b border-border">
                                            <td className="p-4">
                                                <Skeleton className="h-4 w-6" />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-8 w-8 rounded-full" />
                                                    <div className="space-y-1">
                                                        <Skeleton className="h-4 w-16" />
                                                        <Skeleton className="h-3 w-10" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Skeleton className="h-4 w-20 ml-auto" />
                                            </td>
                                            <td className="p-4">
                                                <Skeleton className="h-4 w-14 ml-auto" />
                                            </td>
                                            <td className="p-4 hidden sm:table-cell">
                                                <Skeleton className="h-4 w-14 ml-auto" />
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <Skeleton className="h-4 w-20 ml-auto" />
                                            </td>
                                            <td className="p-4 hidden lg:table-cell">
                                                <Skeleton className="h-4 w-20 ml-auto" />
                                            </td>
                                            <td className="p-4">
                                                <Skeleton className="h-8 w-16 ml-auto" />
                                            </td>
                                        </tr>
                                    ))
                                    : filtered?.map((coin) => (
                                        <tr
                                            key={coin.id}
                                            className="border-b border-border hover:bg-accent/30 transition-colors"
                                        >
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {coin.market_cap_rank}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={coin.image}
                                                        alt={coin.name}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-sm">
                                                            {coin.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground uppercase">
                                                            {coin.symbol}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right font-medium text-sm">
                                                {formatCurrency(coin.current_price)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span
                                                    className={`text-sm font-medium flex items-center justify-end gap-0.5 ${coin.price_change_percentage_24h >= 0
                                                            ? "text-profit"
                                                            : "text-loss"
                                                        }`}
                                                >
                                                    {coin.price_change_percentage_24h >= 0 ? (
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <ArrowDownRight className="h-3.5 w-3.5" />
                                                    )}
                                                    {formatPercentage(
                                                        coin.price_change_percentage_24h
                                                    )}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right hidden sm:table-cell">
                                                <span
                                                    className={`text-sm ${(coin.price_change_percentage_7d_in_currency ??
                                                            0) >= 0
                                                            ? "text-profit"
                                                            : "text-loss"
                                                        }`}
                                                >
                                                    {formatPercentage(
                                                        coin.price_change_percentage_7d_in_currency ?? 0
                                                    )}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-sm text-muted-foreground hidden md:table-cell">
                                                ${formatCompactNumber(coin.market_cap)}
                                            </td>
                                            <td className="p-4 text-right text-sm text-muted-foreground hidden lg:table-cell">
                                                ${formatCompactNumber(coin.total_volume)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Link href={`/trade?coin=${coin.id}`}>
                                                    <Button size="sm" variant="outline" className="text-xs h-8">
                                                        Comprar
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </Button>
                <span className="text-sm text-muted-foreground">Página {page}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!coins || coins.length < 50}
                >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
