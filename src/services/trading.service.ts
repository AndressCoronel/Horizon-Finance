import prisma from "@/lib/prisma";
import { Decimal } from "decimal.js";
import type { TradeInput, DepositInput } from "@/lib/validators";

export async function executeTrade(clerkId: string, trade: TradeInput) {
    const user = await prisma.user.findUnique({
        where: { clerkId },
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

    if (!user) throw new Error("Usuario no encontrado");
    if (!user.portfolio) throw new Error("Portfolio no encontrado");

    // Find or create asset
    let asset = await prisma.asset.findUnique({
        where: { coinGeckoId: trade.coinGeckoId },
    });

    if (!asset) {
        // Create the asset dynamically from CoinGecko data
        const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/${trade.coinGeckoId}?localization=false&tickers=false&community_data=false&developer_data=false`
        );
        if (!res.ok) throw new Error("No se pudo obtener datos del activo");
        const coinData = await res.json();

        asset = await prisma.asset.create({
            data: {
                coinGeckoId: trade.coinGeckoId,
                symbol: coinData.symbol.toUpperCase(),
                name: coinData.name,
                image: coinData.image?.small ?? null,
            },
        });
    }

    const totalCost = new Decimal(trade.quantity).mul(trade.currentPrice);

    if (trade.type === "BUY") {
        // Validate balance
        const balance = new Decimal(user.cashBalanceUSD);
        if (balance.lt(totalCost)) {
            throw new Error(
                `Saldo insuficiente. Necesitás $${totalCost.toFixed(2)} USD pero tenés $${balance.toFixed(2)} USD`
            );
        }

        // Find existing position
        const existingPosition = user.portfolio.positions.find(
            (p) => p.asset.coinGeckoId === trade.coinGeckoId
        );

        await prisma.$transaction(async (tx) => {
            // 1. Deduct balance
            await tx.user.update({
                where: { id: user.id },
                data: {
                    cashBalanceUSD: balance.minus(totalCost).toFixed(8),
                },
            });

            // 2. Update or create position
            if (existingPosition) {
                const oldQty = new Decimal(existingPosition.quantity);
                const oldAvg = new Decimal(existingPosition.averageBuyPrice);
                const newQty = oldQty.plus(trade.quantity);
                // Weighted average price
                const newAvg = oldQty
                    .mul(oldAvg)
                    .plus(new Decimal(trade.quantity).mul(trade.currentPrice))
                    .div(newQty);

                await tx.position.update({
                    where: { id: existingPosition.id },
                    data: {
                        quantity: newQty.toFixed(8),
                        averageBuyPrice: newAvg.toFixed(8),
                    },
                });
            } else {
                await tx.position.create({
                    data: {
                        portfolioId: user.portfolio!.id,
                        assetId: asset!.id,
                        quantity: new Decimal(trade.quantity).toFixed(8),
                        averageBuyPrice: new Decimal(trade.currentPrice).toFixed(8),
                    },
                });
            }

            // 3. Record transaction
            await tx.transaction.create({
                data: {
                    userId: user.id,
                    assetId: asset!.id,
                    type: "BUY",
                    quantity: new Decimal(trade.quantity).toFixed(8),
                    pricePerUnit: new Decimal(trade.currentPrice).toFixed(8),
                    totalAmount: totalCost.toFixed(8),
                    currency: "USD",
                },
            });
        });
    } else {
        // SELL
        const existingPosition = user.portfolio.positions.find(
            (p) => p.asset.coinGeckoId === trade.coinGeckoId
        );

        if (!existingPosition) {
            throw new Error("No tenés este activo en tu portfolio");
        }

        const posQty = new Decimal(existingPosition.quantity);
        const sellQty = new Decimal(trade.quantity);

        if (sellQty.gt(posQty)) {
            throw new Error(
                `No podés vender ${trade.quantity} ${asset.symbol}. Solo tenés ${posQty.toFixed(6)}`
            );
        }

        const proceeds = sellQty.mul(trade.currentPrice);

        await prisma.$transaction(async (tx) => {
            // 1. Add proceeds to balance
            const newBalance = new Decimal(user.cashBalanceUSD).plus(proceeds);
            await tx.user.update({
                where: { id: user.id },
                data: {
                    cashBalanceUSD: newBalance.toFixed(8),
                },
            });

            // 2. Update position
            const remainingQty = posQty.minus(sellQty);
            if (remainingQty.isZero()) {
                await tx.position.delete({
                    where: { id: existingPosition.id },
                });
            } else {
                await tx.position.update({
                    where: { id: existingPosition.id },
                    data: {
                        quantity: remainingQty.toFixed(8),
                    },
                });
            }

            // 3. Record transaction
            await tx.transaction.create({
                data: {
                    userId: user.id,
                    assetId: asset!.id,
                    type: "SELL",
                    quantity: sellQty.toFixed(8),
                    pricePerUnit: new Decimal(trade.currentPrice).toFixed(8),
                    totalAmount: proceeds.toFixed(8),
                    currency: "USD",
                },
            });
        });
    }

    return { success: true };
}

export async function executeDeposit(
    clerkId: string,
    deposit: DepositInput
) {
    const user = await prisma.user.findUnique({
        where: { clerkId },
    });

    if (!user) throw new Error("Usuario no encontrado");

    const amount = new Decimal(deposit.amount);

    await prisma.$transaction(async (tx) => {
        // 1. Add to balance
        if (deposit.currency === "USD") {
            const newBalance = new Decimal(user.cashBalanceUSD).plus(amount);
            await tx.user.update({
                where: { id: user.id },
                data: { cashBalanceUSD: newBalance.toFixed(8) },
            });
        } else {
            const newBalance = new Decimal(user.cashBalanceARS).plus(amount);
            await tx.user.update({
                where: { id: user.id },
                data: { cashBalanceARS: newBalance.toFixed(2) },
            });
        }

        // 2. Record transaction
        await tx.transaction.create({
            data: {
                userId: user.id,
                type: deposit.currency === "USD" ? "DEPOSIT_USD" : "DEPOSIT_ARS",
                totalAmount: amount.toFixed(deposit.currency === "USD" ? 8 : 2),
                currency: deposit.currency,
            },
        });
    });

    return { success: true };
}
