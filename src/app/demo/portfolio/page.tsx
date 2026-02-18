"use client";

import { useDemoPortfolio } from "@/hooks/use-demo-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    PieChart,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import Image from "next/image";

export default function DemoPortfolioPage() {
    const { data: portfolio, isLoading } = useDemoPortfolio();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Portfolio
                </h1>
                <p className="text-muted-foreground mt-1">
                    Detalle completo de tus posiciones
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            Valor Total
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-32" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {formatCurrency(portfolio?.totalValue ?? 0)}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            Costo Total
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-32" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {formatCurrency(portfolio?.totalCost ?? 0)}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            P&L Total
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-32" />
                        ) : (
                            <div
                                className={`text-2xl font-bold flex items-center gap-2 ${(portfolio?.totalProfitLoss ?? 0) >= 0
                                        ? "text-profit"
                                        : "text-loss"
                                    }`}
                            >
                                {(portfolio?.totalProfitLoss ?? 0) >= 0 ? "+" : ""}
                                {formatCurrency(portfolio?.totalProfitLoss ?? 0)}
                                <Badge
                                    variant="secondary"
                                    className={
                                        (portfolio?.totalProfitLossPercentage ?? 0) >= 0
                                            ? "text-profit"
                                            : "text-loss"
                                    }
                                >
                                    {formatPercentage(portfolio?.totalProfitLossPercentage ?? 0)}
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <PortfolioChart
                positions={portfolio?.positions ?? []}
                isLoading={isLoading}
            />

            {/* Positions table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-primary" />
                        Posiciones Detalladas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                                        Activo
                                    </th>
                                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                                        Cantidad
                                    </th>
                                    <th className="text-right py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">
                                        Precio Promedio
                                    </th>
                                    <th className="text-right py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">
                                        Precio Actual
                                    </th>
                                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                                        Valor
                                    </th>
                                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                                        P&L
                                    </th>
                                    <th className="text-right py-3 px-2 text-muted-foreground font-medium hidden md:table-cell">
                                        Asignación
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading
                                    ? Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="border-b border-border/50">
                                            {Array.from({ length: 7 }).map((_, j) => (
                                                <td key={j} className="py-3 px-2">
                                                    <Skeleton className="h-4 w-20" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                    : portfolio?.positions.map((pos) => (
                                        <tr
                                            key={pos.id}
                                            className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                                        >
                                            <td className="py-3 px-2">
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src={pos.image}
                                                        alt={pos.name}
                                                        width={24}
                                                        height={24}
                                                        className="rounded-full"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{pos.name}</p>
                                                        <p className="text-xs text-muted-foreground uppercase">
                                                            {pos.symbol}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-2 text-right font-medium">
                                                {pos.quantity}
                                            </td>
                                            <td className="py-3 px-2 text-right hidden sm:table-cell">
                                                {formatCurrency(pos.averageBuyPrice)}
                                            </td>
                                            <td className="py-3 px-2 text-right hidden sm:table-cell">
                                                {formatCurrency(pos.currentPrice)}
                                            </td>
                                            <td className="py-3 px-2 text-right font-medium">
                                                {formatCurrency(pos.currentValue)}
                                            </td>
                                            <td className="py-3 px-2 text-right">
                                                <div
                                                    className={`flex items-center justify-end gap-1 ${pos.profitLoss >= 0 ? "text-profit" : "text-loss"
                                                        }`}
                                                >
                                                    {pos.profitLoss >= 0 ? (
                                                        <ArrowUpRight className="h-3 w-3" />
                                                    ) : (
                                                        <ArrowDownRight className="h-3 w-3" />
                                                    )}
                                                    {formatPercentage(pos.profitLossPercentage)}
                                                </div>
                                            </td>
                                            <td className="py-3 px-2 text-right text-muted-foreground hidden md:table-cell">
                                                {pos.allocation.toFixed(1)}%
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
