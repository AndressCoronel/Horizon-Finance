"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMarketData, usePortfolio, useTrade, useDeposit } from "@/hooks/use-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowLeftRight,
    DollarSign,
    Wallet,
    AlertCircle,
    CheckCircle2,
    Search,
} from "lucide-react";
import { formatCurrency, formatCrypto } from "@/lib/utils";
import Image from "next/image";

function TradeContent() {
    const searchParams = useSearchParams();
    const preselectedCoin = searchParams.get("coin");

    const [selectedCoin, setSelectedCoin] = useState(preselectedCoin || "");
    const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
    const [quantity, setQuantity] = useState("");
    const [coinSearch, setCoinSearch] = useState("");
    const [depositAmount, setDepositAmount] = useState("");
    const [depositCurrency, setDepositCurrency] = useState<"USD" | "ARS">("USD");
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const { data: coins, isLoading: coinsLoading } = useMarketData();
    const { data: portfolio } = usePortfolio();
    const tradeMutation = useTrade();
    const depositMutation = useDeposit();

    const selectedCoinData = useMemo(
        () => coins?.find((c) => c.id === selectedCoin),
        [coins, selectedCoin]
    );

    const userPosition = useMemo(
        () => portfolio?.positions.find((p) => p.coinGeckoId === selectedCoin),
        [portfolio, selectedCoin]
    );

    const totalCost = selectedCoinData
        ? parseFloat(quantity || "0") * selectedCoinData.current_price
        : 0;

    const filteredCoins = useMemo(
        () =>
            coins?.filter(
                (c) =>
                    c.name.toLowerCase().includes(coinSearch.toLowerCase()) ||
                    c.symbol.toLowerCase().includes(coinSearch.toLowerCase())
            ) ?? [],
        [coins, coinSearch]
    );

    const handleTrade = async () => {
        if (!selectedCoinData || !quantity) return;

        setMessage(null);
        try {
            await tradeMutation.mutateAsync({
                coinGeckoId: selectedCoin,
                type: tradeType,
                quantity: parseFloat(quantity),
                currentPrice: selectedCoinData.current_price,
            });
            setMessage({
                type: "success",
                text: `${tradeType === "BUY" ? "Compra" : "Venta"} ejecutada con éxito`,
            });
            setQuantity("");
        } catch (err) {
            setMessage({
                type: "error",
                text: err instanceof Error ? err.message : "Error al ejecutar operación",
            });
        }
    };

    const handleDeposit = async () => {
        if (!depositAmount) return;

        setMessage(null);
        try {
            await depositMutation.mutateAsync({
                amount: parseFloat(depositAmount),
                currency: depositCurrency,
            });
            setMessage({
                type: "success",
                text: `Depósito de ${formatCurrency(parseFloat(depositAmount), depositCurrency)} realizado con éxito`,
            });
            setDepositAmount("");
        } catch (err) {
            setMessage({
                type: "error",
                text: err instanceof Error ? err.message : "Error al depositar",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
                    <ArrowLeftRight className="h-7 w-7 text-primary" />
                    Trading
                </h1>
                <p className="text-muted-foreground mt-1">
                    Comprá, vendé criptomonedas o depositá fondos
                </p>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`flex items-center gap-2 p-4 rounded-lg border ${message.type === "success"
                            ? "bg-profit/10 border-profit/30 text-profit"
                            : "bg-loss/10 border-loss/30 text-loss"
                        }`}
                >
                    {message.type === "success" ? (
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    )}
                    <p className="text-sm">{message.text}</p>
                </div>
            )}

            {/* Balance Banner */}
            <Card className="bg-gradient-to-r from-horizon-blue/5 to-horizon-purple/5 border-primary/20">
                <CardContent className="py-4">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-primary" />
                            <span className="text-sm text-muted-foreground">Saldo USD:</span>
                            <span className="font-bold">
                                {formatCurrency(portfolio?.cashBalanceUSD ?? 0)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <span className="text-sm text-muted-foreground">Saldo ARS:</span>
                            <span className="font-bold">
                                {formatCurrency(portfolio?.cashBalanceARS ?? 0, "ARS")}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="trade" className="space-y-6">
                <TabsList className="grid grid-cols-2 max-w-sm">
                    <TabsTrigger value="trade">Comprar / Vender</TabsTrigger>
                    <TabsTrigger value="deposit">Depositar</TabsTrigger>
                </TabsList>

                {/* Trade Tab */}
                <TabsContent value="trade">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Coin Select */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Seleccionar Criptomoneda
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar..."
                                        value={coinSearch}
                                        onChange={(e) => setCoinSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                                    {coinsLoading
                                        ? Array.from({ length: 6 }).map((_, i) => (
                                            <Skeleton key={i} className="h-12 w-full" />
                                        ))
                                        : filteredCoins.slice(0, 30).map((coin) => (
                                            <button
                                                key={coin.id}
                                                onClick={() => setSelectedCoin(coin.id)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${selectedCoin === coin.id
                                                        ? "bg-primary/10 border border-primary/30"
                                                        : "hover:bg-accent"
                                                    }`}
                                            >
                                                <Image
                                                    src={coin.image}
                                                    alt={coin.name}
                                                    width={28}
                                                    height={28}
                                                    className="rounded-full"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {coin.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground uppercase">
                                                        {coin.symbol}
                                                    </p>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {formatCurrency(coin.current_price)}
                                                </span>
                                            </button>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trade Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Formulario de Orden</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {selectedCoinData ? (
                                    <>
                                        {/* Selected coin info */}
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                                            <Image
                                                src={selectedCoinData.image}
                                                alt={selectedCoinData.name}
                                                width={36}
                                                height={36}
                                                className="rounded-full"
                                            />
                                            <div>
                                                <p className="font-semibold">
                                                    {selectedCoinData.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatCurrency(selectedCoinData.current_price)} USD
                                                </p>
                                            </div>
                                            {userPosition && (
                                                <Badge variant="secondary" className="ml-auto">
                                                    Tenés {formatCrypto(userPosition.quantity, 4)}{" "}
                                                    {selectedCoinData.symbol.toUpperCase()}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Buy/Sell toggle */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant={tradeType === "BUY" ? "default" : "outline"}
                                                onClick={() => setTradeType("BUY")}
                                                className={
                                                    tradeType === "BUY"
                                                        ? "bg-profit hover:bg-profit/90 text-white"
                                                        : ""
                                                }
                                            >
                                                Comprar
                                            </Button>
                                            <Button
                                                variant={tradeType === "SELL" ? "default" : "outline"}
                                                onClick={() => setTradeType("SELL")}
                                                className={
                                                    tradeType === "SELL"
                                                        ? "bg-loss hover:bg-loss/90 text-white"
                                                        : ""
                                                }
                                            >
                                                Vender
                                            </Button>
                                        </div>

                                        {/* Quantity */}
                                        <div className="space-y-2">
                                            <Label>Cantidad ({selectedCoinData.symbol.toUpperCase()})</Label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                min="0"
                                                step="any"
                                            />
                                            {tradeType === "SELL" && userPosition && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-xs h-7"
                                                    onClick={() =>
                                                        setQuantity(userPosition.quantity.toString())
                                                    }
                                                >
                                                    Max: {formatCrypto(userPosition.quantity, 4)}
                                                </Button>
                                            )}
                                        </div>

                                        {/* Preview */}
                                        <div className="p-4 rounded-lg bg-accent/30 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Precio:</span>
                                                <span>
                                                    {formatCurrency(selectedCoinData.current_price)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Cantidad:
                                                </span>
                                                <span>
                                                    {formatCrypto(parseFloat(quantity || "0"), 4)}{" "}
                                                    {selectedCoinData.symbol.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="border-t border-border my-2" />
                                            <div className="flex justify-between font-bold">
                                                <span>
                                                    {tradeType === "BUY" ? "Total:" : "Recibís:"}
                                                </span>
                                                <span>{formatCurrency(totalCost)}</span>
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <Button
                                            onClick={handleTrade}
                                            disabled={
                                                !quantity ||
                                                parseFloat(quantity) <= 0 ||
                                                tradeMutation.isPending
                                            }
                                            className={`w-full ${tradeType === "BUY"
                                                    ? "bg-profit hover:bg-profit/90"
                                                    : "bg-loss hover:bg-loss/90"
                                                } text-white`}
                                            size="lg"
                                        >
                                            {tradeMutation.isPending
                                                ? "Procesando..."
                                                : `${tradeType === "BUY" ? "Comprar" : "Vender"} ${selectedCoinData.symbol.toUpperCase()}`}
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                        <ArrowLeftRight className="h-12 w-12 mb-4 opacity-30" />
                                        <p className="text-sm">
                                            Seleccioná una criptomoneda para operar
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Deposit Tab */}
                <TabsContent value="deposit">
                    <Card className="max-w-md">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                Depositar Fondos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Currency Select */}
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={depositCurrency === "USD" ? "default" : "outline"}
                                    onClick={() => setDepositCurrency("USD")}
                                >
                                    🇺🇸 USD
                                </Button>
                                <Button
                                    variant={depositCurrency === "ARS" ? "default" : "outline"}
                                    onClick={() => setDepositCurrency("ARS")}
                                >
                                    🇦🇷 ARS
                                </Button>
                            </div>

                            {/* Amount */}
                            <div className="space-y-2">
                                <Label>Monto a depositar</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    min="0"
                                    step="any"
                                />
                            </div>

                            {/* Quick amounts */}
                            <div className="flex flex-wrap gap-2">
                                {(depositCurrency === "USD"
                                    ? [100, 500, 1000, 5000, 10000]
                                    : [10000, 50000, 100000, 500000, 1000000]
                                ).map((amount) => (
                                    <Button
                                        key={amount}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setDepositAmount(amount.toString())}
                                    >
                                        {formatCurrency(amount, depositCurrency)}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                onClick={handleDeposit}
                                disabled={
                                    !depositAmount ||
                                    parseFloat(depositAmount) <= 0 ||
                                    depositMutation.isPending
                                }
                                className="w-full"
                                size="lg"
                            >
                                {depositMutation.isPending
                                    ? "Procesando..."
                                    : `Depositar ${depositAmount ? formatCurrency(parseFloat(depositAmount), depositCurrency) : ""}`}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function TradePage() {
    return (
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <TradeContent />
        </Suspense>
    );
}
