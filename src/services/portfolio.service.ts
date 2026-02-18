import prisma from "@/lib/prisma";
import { Decimal } from "decimal.js";
import { getMarketDataForCoins } from "./market.service";
import type { PositionWithMarketData, PortfolioSummary } from "@/types";

export async function getOrCreatePortfolio(userId: string) {
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: {
            portfolio: {
                include: {
                    positions: {
                        include: { asset: true },
                    },
                },
            },
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.portfolio) {
        const portfolio = await prisma.portfolio.create({
            data: {
                userId: user.id,
            },
            include: {
                positions: {
                    include: { asset: true },
                },
            },
        });
        return { user, portfolio };
    }

    return { user, portfolio: user.portfolio };
}

export async function getPortfolioSummary(
    clerkId: string
): Promise<PortfolioSummary> {
    const { user, portfolio } = await getOrCreatePortfolio(clerkId);

    if (portfolio.positions.length === 0) {
        return {
            totalValue: 0,
            totalCost: 0,
            totalProfitLoss: 0,
            totalProfitLossPercentage: 0,
            cashBalanceUSD: Number(user.cashBalanceUSD),
            cashBalanceARS: Number(user.cashBalanceARS),
            totalPatrimony: Number(user.cashBalanceUSD),
            positionCount: 0,
            positions: [],
        };
    }

    // Get current prices from CoinGecko
    const coinGeckoIds = portfolio.positions.map((p) => p.asset.coinGeckoId);
    const marketData = await getMarketDataForCoins(coinGeckoIds);

    const priceMap = new Map(
        marketData.map((m) => [
            m.id,
            {
                price: m.current_price,
                change24h: m.price_change_percentage_24h,
            },
        ])
    );

    let totalValue = 0;
    let totalCost = 0;

    const positions: PositionWithMarketData[] = portfolio.positions.map((pos) => {
        const quantity = Number(pos.quantity);
        const avgBuyPrice = Number(pos.averageBuyPrice);
        const market = priceMap.get(pos.asset.coinGeckoId);
        const currentPrice = market?.price ?? avgBuyPrice;
        const priceChange24h = market?.change24h ?? 0;

        const posValue = quantity * currentPrice;
        const posCost = quantity * avgBuyPrice;
        const profitLoss = posValue - posCost;
        const profitLossPercentage = posCost > 0 ? (profitLoss / posCost) * 100 : 0;

        totalValue += posValue;
        totalCost += posCost;

        return {
            id: pos.id,
            assetId: pos.assetId,
            coinGeckoId: pos.asset.coinGeckoId,
            symbol: pos.asset.symbol,
            name: pos.asset.name,
            image: pos.asset.image,
            quantity,
            averageBuyPrice: avgBuyPrice,
            currentPrice,
            totalValue: posValue,
            totalCost: posCost,
            profitLoss,
            profitLossPercentage,
            priceChange24h,
            allocation: 0, // calculated below
        };
    });

    // Calculate allocations
    positions.forEach((pos) => {
        pos.allocation = totalValue > 0 ? (pos.totalValue / totalValue) * 100 : 0;
    });

    // Sort by allocation descending
    positions.sort((a, b) => b.allocation - a.allocation);

    const cashUSD = Number(user.cashBalanceUSD);
    const totalProfitLoss = totalValue - totalCost;
    const totalProfitLossPercentage =
        totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

    return {
        totalValue,
        totalCost,
        totalProfitLoss,
        totalProfitLossPercentage,
        cashBalanceUSD: cashUSD,
        cashBalanceARS: Number(user.cashBalanceARS),
        totalPatrimony: totalValue + cashUSD,
        positionCount: positions.length,
        positions,
    };
}
