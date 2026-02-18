import type { CoinMarketData, DolarQuote } from "@/types";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const DOLAR_API_BASE = "https://dolarapi.com/v1";

// ============================================
// CoinGecko API
// ============================================

export async function getMarketData(
    page: number = 1,
    perPage: number = 50
): Promise<CoinMarketData[]> {
    const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`;

    const res = await fetch(url, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error(`CoinGecko API error: ${res.status}`);
    }

    return res.json();
}

export async function getCoinPrices(
    coinIds: string[]
): Promise<Record<string, { usd: number; usd_24h_change: number }>> {
    if (coinIds.length === 0) return {};

    const ids = coinIds.join(",");
    const url = `${COINGECKO_BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

    const res = await fetch(url, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error(`CoinGecko API error: ${res.status}`);
    }

    return res.json();
}

export async function getMarketDataForCoins(
    coinIds: string[]
): Promise<CoinMarketData[]> {
    if (coinIds.length === 0) return [];

    const ids = coinIds.join(",");
    const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=7d`;

    const res = await fetch(url, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error(`CoinGecko API error: ${res.status}`);
    }

    return res.json();
}

export async function searchCoins(
    query: string
): Promise<
    { id: string; symbol: string; name: string; thumb: string }[]
> {
    const url = `${COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`;

    const res = await fetch(url, {
        next: { revalidate: 300 },
    });

    if (!res.ok) {
        throw new Error(`CoinGecko API error: ${res.status}`);
    }

    const data = await res.json();
    return data.coins?.slice(0, 20) ?? [];
}

// ============================================
// DolarAPI
// ============================================

export async function getDolarBlue(): Promise<DolarQuote> {
    const res = await fetch(`${DOLAR_API_BASE}/dolares/blue`, {
        next: { revalidate: 300 },
    });

    if (!res.ok) {
        throw new Error(`DolarAPI error: ${res.status}`);
    }

    return res.json();
}

export async function getAllDolarQuotes(): Promise<DolarQuote[]> {
    const res = await fetch(`${DOLAR_API_BASE}/dolares`, {
        next: { revalidate: 300 },
    });

    if (!res.ok) {
        throw new Error(`DolarAPI error: ${res.status}`);
    }

    return res.json();
}
