// ============================================
// CoinGecko API Types
// ============================================
export interface CoinMarketData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d_in_currency?: number;
    sparkline_in_7d?: {
        price: number[];
    };
    high_24h: number;
    low_24h: number;
    circulating_supply: number;
    max_supply: number | null;
}

export interface CoinDetail {
    id: string;
    symbol: string;
    name: string;
    image: { large: string; small: string; thumb: string };
    market_data: {
        current_price: { usd: number };
        price_change_percentage_24h: number;
        price_change_percentage_7d: number;
        price_change_percentage_30d: number;
        market_cap: { usd: number };
        total_volume: { usd: number };
        high_24h: { usd: number };
        low_24h: { usd: number };
        circulating_supply: number;
        max_supply: number | null;
    };
    description: { en: string };
}

// ============================================
// DolarAPI Types
// ============================================
export interface DolarQuote {
    moneda: string;
    casa: string;
    nombre: string;
    compra: number;
    venta: number;
    fechaActualizacion: string;
}

// ============================================
// Portfolio & Position Types
// ============================================
export interface PositionWithMarketData {
    id: string;
    assetId: string;
    coinGeckoId: string;
    symbol: string;
    name: string;
    image: string | null;
    quantity: number;
    averageBuyPrice: number;
    currentPrice: number;
    totalValue: number;
    totalCost: number;
    profitLoss: number;
    profitLossPercentage: number;
    priceChange24h: number;
    allocation: number; // percentage of total portfolio
}

export interface PortfolioSummary {
    totalValue: number;
    totalCost: number;
    totalProfitLoss: number;
    totalProfitLossPercentage: number;
    cashBalanceUSD: number;
    cashBalanceARS: number;
    totalPatrimony: number; // total value + cash
    positionCount: number;
    positions: PositionWithMarketData[];
}

// ============================================
// Advisor Types
// ============================================
export type RiskLevel = "low" | "medium" | "high";
export type AlertSeverity = "info" | "warning" | "danger";
export type BadgeType =
    | "diversified"
    | "concentrated"
    | "conservative"
    | "aggressive"
    | "balanced";

export interface AdvisorAlert {
    id: string;
    severity: AlertSeverity;
    title: string;
    message: string;
    icon: string;
}

export interface AdvisorRecommendation {
    id: string;
    title: string;
    description: string;
    type: "diversification" | "risk" | "performance" | "general";
}

export interface AssetRiskAnalysis {
    symbol: string;
    name: string;
    volatility24h: number;
    volatility7d: number;
    riskLevel: RiskLevel;
    allocation: number;
}

export interface AdvisorReport {
    healthScore: number; // 0-100
    diversificationScore: number; // 0-100
    riskScore: number; // 0-100 (lower = less risky)
    performanceScore: number; // 0-100
    badges: BadgeType[];
    alerts: AdvisorAlert[];
    recommendations: AdvisorRecommendation[];
    assetRisks: AssetRiskAnalysis[];
    generatedAt: string;
}

// ============================================
// Trade Types
// ============================================
export interface TradeFormData {
    assetId: string;
    coinGeckoId: string;
    type: "BUY" | "SELL";
    quantity: number;
    currentPrice: number;
}

export interface DepositFormData {
    amount: number;
    currency: "USD" | "ARS";
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
