"use client";

import { useState } from "react";
import { useDemoTransactions } from "@/hooks/use-demo-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Receipt,
    ArrowDownLeft,
    ArrowUpRight,
    Banknote,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

const typeLabels: Record<string, { label: string; color: string; icon: typeof ArrowDownLeft }> = {
    BUY: { label: "Compra", color: "text-profit", icon: ArrowDownLeft },
    SELL: { label: "Venta", color: "text-loss", icon: ArrowUpRight },
    DEPOSIT_USD: { label: "Depósito USD", color: "text-horizon-blue", icon: Banknote },
    DEPOSIT_ARS: { label: "Depósito ARS", color: "text-horizon-purple", icon: Banknote },
};

const filters = [
    { value: "", label: "Todas" },
    { value: "BUY", label: "Compras" },
    { value: "SELL", label: "Ventas" },
    { value: "DEPOSIT_USD", label: "Depósitos USD" },
    { value: "DEPOSIT_ARS", label: "Depósitos ARS" },
];

export default function DemoTransactionsPage() {
    const [filter, setFilter] = useState("");
    const { data, isLoading } = useDemoTransactions(1, filter || undefined);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Transacciones
                </h1>
                <p className="text-muted-foreground mt-1">
                    Historial completo de operaciones
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                    <Button
                        key={f.value}
                        variant={filter === f.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(f.value)}
                    >
                        {f.label}
                    </Button>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-primary" />
                        Historial
                        <Badge variant="secondary">{data?.total ?? 0} operaciones</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {isLoading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            ))
                            : data?.transactions.map((tx) => {
                                const meta = typeLabels[tx.type] || typeLabels.BUY;
                                const Icon = meta.icon;
                                return (
                                    <div
                                        key={tx.id}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center bg-accent ${meta.color}`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">
                                                    {meta.label}
                                                </span>
                                                {tx.asset && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Image
                                                            src={tx.asset.image}
                                                            alt={tx.asset.name}
                                                            width={16}
                                                            height={16}
                                                            className="rounded-full"
                                                        />
                                                        <span className="text-xs text-muted-foreground">
                                                            {tx.asset.name}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(tx.createdAt).toLocaleDateString("es-AR", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                                {tx.quantity &&
                                                    ` • ${tx.quantity} ${tx.asset?.symbol?.toUpperCase() ?? ""} @ ${formatCurrency(tx.pricePerUnit ?? 0)}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-medium text-sm ${meta.color}`}>
                                                {tx.type === "SELL" ? "+" : "-"}
                                                {formatCurrency(
                                                    tx.totalAmount,
                                                    tx.currency === "ARS" ? "ARS" : "USD"
                                                )}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground uppercase">
                                                {tx.currency}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
