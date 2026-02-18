"use client";

import { usePortfolio, useDolarBlue } from "@/hooks/use-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { formatCurrency, formatPercentage, formatCrypto } from "@/lib/utils";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import Image from "next/image";

export default function PortfolioPage() {
    const { data: portfolio, isLoading } = usePortfolio();
    const { data: dolar } = useDolarBlue();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Wallet className="h-7 w-7 text-primary" />
                    Portfolio
                </h1>
                <p className="text-muted-foreground mt-1">
                    Detalle completo de tus inversiones
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-1">
                    <PortfolioChart
                        positions={portfolio?.positions ?? []}
                        isLoading={isLoading}
                    />
                </div>

                {/* Summary */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">Valor Total</p>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-32 mt-1" />
                                ) : (
                                    <p className="text-2xl font-bold mt-1">
                                        {formatCurrency(portfolio?.totalValue ?? 0)}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">
                                    Ganancia / Pérdida
                                </p>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-32 mt-1" />
                                ) : (
                                    <p
                                        className={`text-2xl font-bold mt-1 ${(portfolio?.totalProfitLoss ?? 0) >= 0
                                                ? "text-profit"
                                                : "text-loss"
                                            }`}
                                    >
                                        {(portfolio?.totalProfitLoss ?? 0) >= 0 ? "+" : ""}
                                        {formatCurrency(portfolio?.totalProfitLoss ?? 0)}
                                        <span className="text-sm ml-2">
                                            ({formatPercentage(
                                                portfolio?.totalProfitLossPercentage ?? 0
                                            )})
                                        </span>
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Positions Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Posiciones</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left text-xs font-medium text-muted-foreground p-4">
                                        Activo
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground p-4">
                                        Cantidad
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground p-4 hidden sm:table-cell">
                                        Precio Prom.
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground p-4">
                                        Precio Actual
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground p-4 hidden sm:table-cell">
                                        Valor Total
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground p-4">
                                        P/L
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground p-4 hidden md:table-cell">
                                        Asignación
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="border-b border-border">
                                            {Array.from({ length: 7 }).map((_, j) => (
                                                <td key={j} className="p-4">
                                                    <Skeleton className="h-4 w-20" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                    : portfolio?.positions.map((pos) => (
                                        <tr
                                            key={pos.id}
                                            className="border-b border-border hover:bg-accent/30 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {pos.image ? (
                                                        <Image
                                                            src={pos.image}
                                                            alt={pos.name}
                                                            width={32}
                                                            height={32}
                                                            className="rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
                                                            {pos.symbol.slice(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-sm">
                                                            {pos.symbol.toUpperCase()}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {pos.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right text-sm font-medium">
                                                {formatCrypto(pos.quantity, 4)}
                                            </td>
                                            <td className="p-4 text-right text-sm text-muted-foreground hidden sm:table-cell">
                                                {formatCurrency(pos.averageBuyPrice)}
                                            </td>
                                            <td className="p-4 text-right text-sm font-medium">
                                                {formatCurrency(pos.currentPrice)}
                                            </td>
                                            <td className="p-4 text-right text-sm font-medium hidden sm:table-cell">
                                                {formatCurrency(pos.totalValue)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="space-y-0.5">
                                                    <p
                                                        className={`text-sm font-medium ${pos.profitLoss >= 0
                                                                ? "text-profit"
                                                                : "text-loss"
                                                            }`}
                                                    >
                                                        {pos.profitLoss >= 0 ? "+" : ""}
                                                        {formatCurrency(pos.profitLoss)}
                                                    </p>
                                                    <div
                                                        className={`text-xs flex items-center justify-end gap-0.5 ${pos.profitLossPercentage >= 0
                                                                ? "text-profit"
                                                                : "text-loss"
                                                            }`}
                                                    >
                                                        {pos.profitLossPercentage >= 0 ? (
                                                            <ArrowUpRight className="h-3 w-3" />
                                                        ) : (
                                                            <ArrowDownRight className="h-3 w-3" />
                                                        )}
                                                        {formatPercentage(pos.profitLossPercentage)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right hidden md:table-cell">
                                                <Badge variant="secondary" className="text-xs">
                                                    {pos.allocation.toFixed(1)}%
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {!isLoading && portfolio?.positions.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <Wallet className="h-12 w-12 mb-4 opacity-30" />
                            <p className="text-sm">No tenés posiciones todavía</p>
                            <p className="text-xs mt-1">
                                Depositá fondos y comprá tu primera cripto
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
