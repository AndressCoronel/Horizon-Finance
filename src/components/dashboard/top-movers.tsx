"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { PositionWithMarketData } from "@/types";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import Image from "next/image";

interface TopMoversProps {
    positions: PositionWithMarketData[];
    isLoading: boolean;
}

export function TopMovers({ positions, isLoading }: TopMoversProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Tus Activos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (positions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Tus Activos</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <p className="text-sm">No tenés activos todavía</p>
                    <p className="text-xs mt-1">
                        Depositá fondos y comprá tu primera cripto
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Sort by P&L percentage
    const sorted = [...positions].sort(
        (a, b) => b.profitLossPercentage - a.profitLossPercentage
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Tus Activos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {sorted.map((pos) => (
                        <div
                            key={pos.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                        >
                            {/* Asset icon */}
                            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
                                {pos.image ? (
                                    <Image
                                        src={pos.image}
                                        alt={pos.name}
                                        width={36}
                                        height={36}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <span className="text-xs font-bold">
                                        {pos.symbol.slice(0, 2).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {/* Asset info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">
                                        {pos.symbol.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">
                                        {pos.name}
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {pos.quantity.toFixed(4)} × {formatCurrency(pos.currentPrice)}
                                </div>
                            </div>

                            {/* Value & P/L */}
                            <div className="text-right flex-shrink-0">
                                <div className="font-semibold text-sm">
                                    {formatCurrency(pos.totalValue)}
                                </div>
                                <div
                                    className={`text-xs flex items-center justify-end gap-0.5 ${pos.profitLossPercentage >= 0 ? "text-profit" : "text-loss"
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
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
