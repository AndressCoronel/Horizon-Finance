"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
    CoinMarketData,
    PortfolioSummary,
    DolarQuote,
    AdvisorReport,
    ApiResponse,
} from "@/types";

// ============================================
// Market Hooks
// ============================================
export function useMarketData(page: number = 1) {
    return useQuery<CoinMarketData[]>({
        queryKey: ["market", page],
        queryFn: async () => {
            const res = await fetch(`/api/market?page=${page}&per_page=50`);
            const json: ApiResponse<CoinMarketData[]> = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data!;
        },
        refetchInterval: 60 * 1000,
    });
}

export function useDolarBlue() {
    return useQuery<DolarQuote>({
        queryKey: ["dolar-blue"],
        queryFn: async () => {
            const res = await fetch("/api/dolar");
            const json: ApiResponse<DolarQuote> = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data!;
        },
        refetchInterval: 5 * 60 * 1000, // Every 5 minutes
    });
}

// ============================================
// Portfolio Hooks
// ============================================
export function usePortfolio() {
    return useQuery<PortfolioSummary>({
        queryKey: ["portfolio"],
        queryFn: async () => {
            const res = await fetch("/api/portfolio");
            const json: ApiResponse<PortfolioSummary> = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data!;
        },
        refetchInterval: 60 * 1000,
    });
}

// ============================================
// Trading Hooks
// ============================================
export function useTrade() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            coinGeckoId: string;
            type: "BUY" | "SELL";
            quantity: number;
            currentPrice: number;
        }) => {
            const res = await fetch("/api/trade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
    });
}

export function useDeposit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { amount: number; currency: "USD" | "ARS" }) => {
            const res = await fetch("/api/deposit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
    });
}

// ============================================
// Transactions Hooks
// ============================================
export function useTransactions(
    page: number = 1,
    type?: string
) {
    return useQuery({
        queryKey: ["transactions", page, type],
        queryFn: async () => {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (type) params.set("type", type);
            const res = await fetch(`/api/transactions?${params}`);
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data as {
                transactions: Array<{
                    id: string;
                    type: string;
                    quantity: number | null;
                    pricePerUnit: number | null;
                    totalAmount: number;
                    currency: string;
                    asset: {
                        symbol: string;
                        name: string;
                        image: string | null;
                        coinGeckoId: string;
                    } | null;
                    createdAt: string;
                }>;
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            };
        },
    });
}

// ============================================
// Advisor Hooks
// ============================================
export function useAdvisor() {
    return useQuery<AdvisorReport>({
        queryKey: ["advisor"],
        queryFn: async () => {
            const res = await fetch("/api/advisor");
            const json: ApiResponse<AdvisorReport> = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data!;
        },
        refetchInterval: 5 * 60 * 1000,
    });
}
