"use client";

import { useSearchParams } from "next/navigation";
import { useDemoMarketData, useDemoPortfolio } from "@/hooks/use-demo-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeftRight,
    TrendingUp,
    TrendingDown,
    Lock,
    Wallet,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function DemoTradePage() {
    const searchParams = useSearchParams();
    const selectedCoin = searchParams.get("coin") || "bitcoin";
    const { data: coins } = useDemoMarketData(1, 50);
    const { data: portfolio } = useDemoPortfolio();

    const coin = coins?.find((c) => c.id === selectedCoin) || coins?.[0];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Trading
                </h1>
                <p className="text-muted-foreground mt-1">
                    Compra y venta simulada de criptomonedas
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coin selector */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Seleccionar Activo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                            {coins?.slice(0, 20).map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/demo/trade?coin=${c.id}`}
                                    className={`flex items-center justify-between p-2.5 rounded-lg transition-colors cursor-pointer ${c.id === selectedCoin
                                            ? "bg-primary/10 border border-primary/20"
                                            : "hover:bg-accent"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={c.image}
                                            alt={c.name}
                                            width={28}
                                            height={28}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">{c.name}</p>
                                            <p className="text-xs text-muted-foreground uppercase">
                                                {c.symbol}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {formatCurrency(c.current_price)}
                                        </p>
                                        <p
                                            className={`text-xs ${c.price_change_percentage_24h >= 0
                                                    ? "text-profit"
                                                    : "text-loss"
                                                }`}
                                        >
                                            {c.price_change_percentage_24h >= 0 ? "+" : ""}
                                            {formatPercentage(c.price_change_percentage_24h)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Trade form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Selected coin info */}
                    {coin && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={coin.image}
                                            alt={coin.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <h3 className="text-lg font-bold">{coin.name}</h3>
                                            <p className="text-sm text-muted-foreground uppercase">
                                                {coin.symbol}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(coin.current_price)}
                                        </p>
                                        <Badge
                                            variant="secondary"
                                            className={
                                                coin.price_change_percentage_24h >= 0
                                                    ? "text-profit"
                                                    : "text-loss"
                                            }
                                        >
                                            {coin.price_change_percentage_24h >= 0 ? (
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3 mr-1" />
                                            )}
                                            {formatPercentage(coin.price_change_percentage_24h)} (24h)
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Demo trade form (read-only) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ArrowLeftRight className="h-5 w-5" />
                                Ejecutar Operación
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Button className="flex-1 bg-profit/90 hover:bg-profit text-white">
                                    Comprar
                                </Button>
                                <Button variant="outline" className="flex-1 text-loss border-loss/30">
                                    Vender
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cantidad (USD)</label>
                                <Input type="number" placeholder="1000.00" value="1000" readOnly />
                            </div>

                            {coin && (
                                <div className="p-3 rounded-lg bg-accent/50 text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Recibirías:</span>
                                        <span className="font-medium">
                                            {(1000 / coin.current_price).toFixed(6)} {coin.symbol.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Precio por unidad:
                                        </span>
                                        <span>{formatCurrency(coin.current_price)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Locked button */}
                            <Button
                                disabled
                                className="w-full gap-2 opacity-60"
                            >
                                <Lock className="h-4 w-4" />
                                Iniciá sesión para operar
                            </Button>

                            <div className="text-center">
                                <Link href="/sign-up">
                                    <Button variant="link" className="text-primary text-sm">
                                        Crear cuenta gratis para empezar a operar →
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Balance card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Wallet className="h-4 w-4" />
                                Saldo Demo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-6">
                                <div>
                                    <p className="text-xs text-muted-foreground">USD</p>
                                    <p className="text-lg font-bold">
                                        {formatCurrency(portfolio?.cashBalanceUSD ?? 15000)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">ARS</p>
                                    <p className="text-lg font-bold">
                                        {formatCurrency(portfolio?.cashBalanceARS ?? 5000000, "ARS")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
