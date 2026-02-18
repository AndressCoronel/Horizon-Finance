"use client";

import { useState } from "react";
import { useDemoMarketData } from "@/hooks/use-demo-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Search,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    Globe,
} from "lucide-react";
import { formatCurrency, formatPercentage, formatCompactNumber } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function DemoMarketPage() {
    const [search, setSearch] = useState("");
    const { data: coins, isLoading } = useDemoMarketData(1, 50);

    const filtered = coins?.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.symbol.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Market Explorer
                </h1>
                <p className="text-muted-foreground mt-1">
                    Cotizaciones en tiempo real de las principales criptomonedas
                </p>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar criptomoneda..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        Top Criptomonedas
                        <Badge variant="secondary" className="ml-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-profit mr-1.5 live-pulse" />
                            Live
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                                        #
                                    </th>
                                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                                        Activo
                                    </th>
                                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                                        Precio
                                    </th>
                                    <th className="text-right py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">
                                        24h %
                                    </th>
                                    <th className="text-right py-3 px-2 text-muted-foreground font-medium hidden md:table-cell">
                                        Market Cap
                                    </th>
                                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading
                                    ? Array.from({ length: 10 }).map((_, i) => (
                                        <tr key={i} className="border-b border-border/50">
                                            <td className="py-3 px-2">
                                                <Skeleton className="h-4 w-4" />
                                            </td>
                                            <td className="py-3 px-2">
                                                <Skeleton className="h-6 w-32" />
                                            </td>
                                            <td className="py-3 px-2">
                                                <Skeleton className="h-4 w-20 ml-auto" />
                                            </td>
                                            <td className="py-3 px-2 hidden sm:table-cell">
                                                <Skeleton className="h-4 w-16 ml-auto" />
                                            </td>
                                            <td className="py-3 px-2 hidden md:table-cell">
                                                <Skeleton className="h-4 w-24 ml-auto" />
                                            </td>
                                            <td className="py-3 px-2">
                                                <Skeleton className="h-8 w-16 ml-auto" />
                                            </td>
                                        </tr>
                                    ))
                                    : filtered?.map((coin) => (
                                        <tr
                                            key={coin.id}
                                            className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                                        >
                                            <td className="py-3 px-2 text-muted-foreground">
                                                {coin.market_cap_rank}
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src={coin.image}
                                                        alt={coin.name}
                                                        width={24}
                                                        height={24}
                                                        className="rounded-full"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{coin.name}</p>
                                                        <p className="text-xs text-muted-foreground uppercase">
                                                            {coin.symbol}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-2 text-right font-medium">
                                                {formatCurrency(coin.current_price)}
                                            </td>
                                            <td className="py-3 px-2 text-right hidden sm:table-cell">
                                                <span
                                                    className={`inline-flex items-center gap-0.5 ${coin.price_change_percentage_24h >= 0
                                                        ? "text-profit"
                                                        : "text-loss"
                                                        }`}
                                                >
                                                    {coin.price_change_percentage_24h >= 0 ? (
                                                        <TrendingUp className="h-3 w-3" />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3" />
                                                    )}
                                                    {formatPercentage(
                                                        coin.price_change_percentage_24h
                                                    )}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-right text-muted-foreground hidden md:table-cell">
                                                {formatCompactNumber(coin.market_cap)}
                                            </td>
                                            <td className="py-3 px-2 text-right">
                                                <Link href={`/demo/trade?coin=${coin.id}`}>
                                                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                                                        <ArrowUpRight className="h-3 w-3" />
                                                        Trade
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
        </div>
    );
}
