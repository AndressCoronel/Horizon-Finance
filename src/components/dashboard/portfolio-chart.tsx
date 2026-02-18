"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PositionWithMarketData } from "@/types";
import { formatCurrency } from "@/lib/utils";

const COLORS = [
    "oklch(0.55 0.22 265)", // blue
    "oklch(0.6 0.22 300)",  // purple
    "oklch(0.7 0.15 200)",  // cyan
    "oklch(0.65 0.2 145)",  // green
    "oklch(0.75 0.15 80)",  // yellow
    "oklch(0.6 0.22 25)",   // orange
    "oklch(0.55 0.18 340)", // pink
    "oklch(0.65 0.15 160)", // teal
];

interface PortfolioChartProps {
    positions: PositionWithMarketData[];
    isLoading: boolean;
}

export function PortfolioChart({ positions, isLoading }: PortfolioChartProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Distribución</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Skeleton className="h-48 w-48 rounded-full" />
                </CardContent>
            </Card>
        );
    }

    if (positions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Distribución</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <p className="text-sm">Sin activos en el portfolio</p>
                    <p className="text-xs mt-1">Comprá cripto para ver la distribución</p>
                </CardContent>
            </Card>
        );
    }

    const data = positions.map((pos) => ({
        name: pos.symbol.toUpperCase(),
        value: pos.totalValue,
        allocation: pos.allocation,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Distribución del Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload?.[0]) {
                                        const item = payload[0].payload;
                                        return (
                                            <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                                                <p className="font-semibold text-sm">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatCurrency(item.value)}
                                                </p>
                                                <p className="text-xs text-primary">
                                                    {item.allocation.toFixed(1)}%
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-4 space-y-2">
                    {data.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="font-medium">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-muted-foreground">
                                    {formatCurrency(item.value)}
                                </span>
                                <span className="text-xs text-primary font-medium w-12 text-right">
                                    {item.allocation.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
