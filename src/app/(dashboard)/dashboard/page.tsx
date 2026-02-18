"use client";

import { useEffect } from "react";
import { usePortfolio, useDolarBlue } from "@/hooks/use-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { TopMovers } from "@/components/dashboard/top-movers";

export default function DashboardPage() {
    const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();
    const { data: dolar, isLoading: dolarLoading } = useDolarBlue();

    // Sync user on first load + claim demo data if new user
    useEffect(() => {
        fetch("/api/user/sync")
            .then((res) => res.json())
            .then(async (data) => {
                if (data.success) {
                    // Try to claim demo data for this user
                    const claimRes = await fetch("/api/user/claim-demo", {
                        method: "POST",
                    });
                    const claimData = await claimRes.json();
                    if (claimData.success) {
                        // Refresh portfolio data
                        window.location.reload();
                    }
                }
            })
            .catch(() => { });
    }, []);

    const arsValue =
        portfolio && dolar
            ? portfolio.totalPatrimony * dolar.venta + portfolio.cashBalanceARS
            : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                    Resumen de tu portfolio de inversiones
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Patrimony USD */}
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Patrimonio Total
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {portfolioLoading ? (
                            <Skeleton className="h-8 w-32" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(portfolio?.totalPatrimony ?? 0)}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {dolarLoading ? (
                                        <Skeleton className="h-3 w-24 inline-block" />
                                    ) : (
                                        `≈ ${formatCurrency(arsValue, "ARS")} ARS`
                                    )}
                                </div>
                            </>
                        )}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-horizon-blue/10 to-transparent rounded-bl-full" />
                    </CardContent>
                </Card>

                {/* Portfolio Value */}
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Valor del Portfolio
                        </CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {portfolioLoading ? (
                            <Skeleton className="h-8 w-32" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(portfolio?.totalValue ?? 0)}
                                </div>
                                <div className="text-xs mt-1">
                                    <span className="text-muted-foreground">
                                        {portfolio?.positionCount ?? 0} activos
                                    </span>
                                </div>
                            </>
                        )}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-horizon-purple/10 to-transparent rounded-bl-full" />
                    </CardContent>
                </Card>

                {/* P&L */}
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Ganancia / Pérdida
                        </CardTitle>
                        {(portfolio?.totalProfitLoss ?? 0) >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-profit" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-loss" />
                        )}
                    </CardHeader>
                    <CardContent>
                        {portfolioLoading ? (
                            <Skeleton className="h-8 w-32" />
                        ) : (
                            <>
                                <div
                                    className={`text-2xl font-bold ${(portfolio?.totalProfitLoss ?? 0) >= 0
                                        ? "text-profit"
                                        : "text-loss"
                                        }`}
                                >
                                    {(portfolio?.totalProfitLoss ?? 0) >= 0 ? "+" : ""}
                                    {formatCurrency(portfolio?.totalProfitLoss ?? 0)}
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={`mt-1 text-xs ${(portfolio?.totalProfitLossPercentage ?? 0) >= 0
                                        ? "text-profit"
                                        : "text-loss"
                                        }`}
                                >
                                    {(portfolio?.totalProfitLossPercentage ?? 0) >= 0 ? (
                                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 mr-0.5" />
                                    )}
                                    {formatPercentage(
                                        portfolio?.totalProfitLossPercentage ?? 0
                                    )}
                                </Badge>
                            </>
                        )}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-profit/10 to-transparent rounded-bl-full" />
                    </CardContent>
                </Card>

                {/* Cash Balance */}
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Saldo Disponible
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {portfolioLoading ? (
                            <Skeleton className="h-8 w-32" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(portfolio?.cashBalanceUSD ?? 0)}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    + {formatCurrency(portfolio?.cashBalanceARS ?? 0, "ARS")} ARS
                                </div>
                            </>
                        )}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-horizon-cyan/10 to-transparent rounded-bl-full" />
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <PortfolioChart positions={portfolio?.positions ?? []} isLoading={portfolioLoading} />
                </div>
                <div className="lg:col-span-3">
                    <TopMovers positions={portfolio?.positions ?? []} isLoading={portfolioLoading} />
                </div>
            </div>

            {/* Dolar Blue Widget */}
            {dolar && (
                <Card className="max-w-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-horizon-blue live-pulse" />
                            Dólar Blue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-xs text-muted-foreground">Compra</p>
                                <p className="text-lg font-bold">
                                    {formatCurrency(dolar.compra, "ARS")}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Venta</p>
                                <p className="text-lg font-bold">
                                    {formatCurrency(dolar.venta, "ARS")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
