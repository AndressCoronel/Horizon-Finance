"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/use-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ScrollText,
    ArrowDownLeft,
    ArrowUpRight,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    Filter,
} from "lucide-react";
import { formatCurrency, formatCrypto } from "@/lib/utils";
import Image from "next/image";

const typeConfig: Record<
    string,
    { label: string; color: string; icon: React.ElementType }
> = {
    BUY: {
        label: "Compra",
        color: "text-profit bg-profit/10 border-profit/20",
        icon: ArrowDownLeft,
    },
    SELL: {
        label: "Venta",
        color: "text-loss bg-loss/10 border-loss/20",
        icon: ArrowUpRight,
    },
    DEPOSIT_USD: {
        label: "Depósito USD",
        color: "text-horizon-blue bg-horizon-blue/10 border-horizon-blue/20",
        icon: DollarSign,
    },
    DEPOSIT_ARS: {
        label: "Depósito ARS",
        color: "text-horizon-purple bg-horizon-purple/10 border-horizon-purple/20",
        icon: DollarSign,
    },
};

const filterOptions = [
    { value: "", label: "Todos" },
    { value: "BUY", label: "Compras" },
    { value: "SELL", label: "Ventas" },
    { value: "DEPOSIT_USD", label: "Depósitos USD" },
    { value: "DEPOSIT_ARS", label: "Depósitos ARS" },
];

export default function TransactionsPage() {
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState("");

    const { data, isLoading } = useTransactions(page, typeFilter || undefined);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
                    <ScrollText className="h-7 w-7 text-primary" />
                    Transacciones
                </h1>
                <p className="text-muted-foreground mt-1">
                    Historial completo de operaciones
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {filterOptions.map((opt) => (
                    <Button
                        key={opt.value}
                        variant={typeFilter === opt.value ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => {
                            setTypeFilter(opt.value);
                            setPage(1);
                        }}
                    >
                        {opt.label}
                    </Button>
                ))}
            </div>

            {/* Transactions List */}
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        {isLoading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            ))
                            : data?.transactions.map((tx) => {
                                const config = typeConfig[tx.type] ?? typeConfig.BUY;
                                const TxIcon = config.icon;

                                return (
                                    <div
                                        key={tx.id}
                                        className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors"
                                    >
                                        {/* Icon */}
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color} border`}
                                        >
                                            <TxIcon className="h-5 w-5" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] ${config.color}`}
                                                >
                                                    {config.label}
                                                </Badge>
                                                {tx.asset && (
                                                    <div className="flex items-center gap-1.5">
                                                        {tx.asset.image && (
                                                            <Image
                                                                src={tx.asset.image}
                                                                alt={tx.asset.symbol}
                                                                width={16}
                                                                height={16}
                                                                className="rounded-full"
                                                            />
                                                        )}
                                                        <span className="text-sm font-medium">
                                                            {tx.asset.symbol.toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3">
                                                {tx.quantity && (
                                                    <span>
                                                        Cant: {formatCrypto(tx.quantity, 4)}
                                                    </span>
                                                )}
                                                {tx.pricePerUnit && (
                                                    <span>
                                                        Precio: {formatCurrency(tx.pricePerUnit)}
                                                    </span>
                                                )}
                                                <span>
                                                    {new Date(tx.createdAt).toLocaleString("es-AR", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-semibold text-sm">
                                                {tx.type === "SELL" ? "+" : tx.type === "BUY" ? "-" : "+"}
                                                {formatCurrency(
                                                    tx.totalAmount,
                                                    tx.currency as "USD" | "ARS"
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

                    {!isLoading && data?.transactions.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <ScrollText className="h-12 w-12 mb-4 opacity-30" />
                            <p className="text-sm">No hay transacciones</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
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
                    <span className="text-sm text-muted-foreground">
                        Página {page} de {data.pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= data.pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
