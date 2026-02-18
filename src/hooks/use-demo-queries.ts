"use client";

import { useQuery } from "@tanstack/react-query";
import {
    demoPortfolio,
    demoTransactions,
    demoAdvisor,
    demoDolar,
} from "@/lib/demo-data";
import type { CoinMarketData, DolarQuote } from "@/types";

// Market data — uses real API (public, no auth needed)
export function useDemoMarketData(page = 1, perPage = 50) {
    return useQuery<CoinMarketData[]>({
        queryKey: ["demo-market", page, perPage],
        queryFn: async () => {
            const res = await fetch(`/api/market?page=${page}&per_page=${perPage}`);
            if (!res.ok) throw new Error("Failed to fetch market data");
            const json = await res.json();
            return json.data;
        },
        staleTime: 60000,
    });
}

// Portfolio — uses hardcoded demo data
export function useDemoPortfolio() {
    return useQuery({
        queryKey: ["demo-portfolio"],
        queryFn: async () => demoPortfolio,
        staleTime: Infinity,
    });
}

// Dollar Blue — uses real API (public)
export function useDemoDolarBlue() {
    return useQuery<DolarQuote>({
        queryKey: ["demo-dolar"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/dolar");
                if (!res.ok) throw new Error("Failed");
                const json = await res.json();
                return json.data;
            } catch {
                return demoDolar;
            }
        },
        staleTime: 60000,
    });
}

// Transactions — uses hardcoded demo data
export function useDemoTransactions(page = 1, type?: string) {
    return useQuery({
        queryKey: ["demo-transactions", page, type],
        queryFn: async () => {
            let txs = demoTransactions.transactions;
            if (type) {
                txs = txs.filter((t) => t.type === type);
            }
            return {
                ...demoTransactions,
                transactions: txs,
                total: txs.length,
                totalPages: 1,
            };
        },
        staleTime: Infinity,
    });
}

// Advisor — uses hardcoded demo data
export function useDemoAdvisor() {
    return useQuery({
        queryKey: ["demo-advisor"],
        queryFn: async () => demoAdvisor,
        staleTime: Infinity,
    });
}
