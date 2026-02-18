import { PrismaClient, Currency, TransactionType } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { Decimal } from "decimal.js";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEMO_CLERK_ID = "demo_user_clerk_id";

async function main() {
    console.log("🌱 Seeding database...");

    // Clean existing demo data
    const existingUser = await prisma.user.findUnique({
        where: { clerkId: DEMO_CLERK_ID },
    });

    if (existingUser) {
        await prisma.transaction.deleteMany({ where: { userId: existingUser.id } });
        await prisma.position.deleteMany({
            where: { portfolio: { userId: existingUser.id } },
        });
        await prisma.portfolio.deleteMany({ where: { userId: existingUser.id } });
        await prisma.user.delete({ where: { id: existingUser.id } });
    }

    // Create assets
    const assets = [
        {
            coinGeckoId: "bitcoin",
            symbol: "BTC",
            name: "Bitcoin",
            image: "https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png",
        },
        {
            coinGeckoId: "ethereum",
            symbol: "ETH",
            name: "Ethereum",
            image: "https://coin-images.coingecko.com/coins/images/279/small/ethereum.png",
        },
        {
            coinGeckoId: "solana",
            symbol: "SOL",
            name: "Solana",
            image: "https://coin-images.coingecko.com/coins/images/4128/small/solana.png",
        },
        {
            coinGeckoId: "cardano",
            symbol: "ADA",
            name: "Cardano",
            image: "https://coin-images.coingecko.com/coins/images/975/small/cardano.png",
        },
        {
            coinGeckoId: "binancecoin",
            symbol: "BNB",
            name: "BNB",
            image: "https://coin-images.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
        },
    ];

    const createdAssets: Record<string, string> = {};

    for (const asset of assets) {
        const created = await prisma.asset.upsert({
            where: { coinGeckoId: asset.coinGeckoId },
            update: { image: asset.image },
            create: asset,
        });
        createdAssets[asset.coinGeckoId] = created.id;
    }

    // Create demo user
    const user = await prisma.user.create({
        data: {
            clerkId: DEMO_CLERK_ID,
            email: "demo@horizonfinance.com",
            firstName: "Demo",
            lastName: "User",
            preferredCurrency: Currency.USD,
            cashBalanceUSD: new Decimal("10000.00").toString(),
            cashBalanceARS: new Decimal("5000000.00").toString(),
            portfolio: {
                create: {
                    name: "Mi Portfolio",
                    positions: {
                        create: [
                            {
                                assetId: createdAssets["bitcoin"],
                                quantity: new Decimal("0.5").toString(),
                                averageBuyPrice: new Decimal("42000.00").toString(),
                            },
                            {
                                assetId: createdAssets["ethereum"],
                                quantity: new Decimal("3.2").toString(),
                                averageBuyPrice: new Decimal("2200.00").toString(),
                            },
                            {
                                assetId: createdAssets["solana"],
                                quantity: new Decimal("150.0").toString(),
                                averageBuyPrice: new Decimal("95.00").toString(),
                            },
                            {
                                assetId: createdAssets["cardano"],
                                quantity: new Decimal("5000.0").toString(),
                                averageBuyPrice: new Decimal("0.45").toString(),
                            },
                            {
                                assetId: createdAssets["binancecoin"],
                                quantity: new Decimal("2.0").toString(),
                                averageBuyPrice: new Decimal("310.00").toString(),
                            },
                        ],
                    },
                },
            },
        },
    });

    // Create demo transactions
    const now = new Date();
    const transactions = [
        // Initial deposits
        {
            userId: user.id,
            type: TransactionType.DEPOSIT_USD,
            totalAmount: "50000.00",
            currency: Currency.USD,
            createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
        {
            userId: user.id,
            type: TransactionType.DEPOSIT_ARS,
            totalAmount: "5000000.00",
            currency: Currency.ARS,
            createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
        // BTC purchases
        {
            userId: user.id,
            assetId: createdAssets["bitcoin"],
            type: TransactionType.BUY,
            quantity: "0.3",
            pricePerUnit: "40000.00",
            totalAmount: "12000.00",
            currency: Currency.USD,
            createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        },
        {
            userId: user.id,
            assetId: createdAssets["bitcoin"],
            type: TransactionType.BUY,
            quantity: "0.2",
            pricePerUnit: "45000.00",
            totalAmount: "9000.00",
            currency: Currency.USD,
            createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        },
        // ETH purchases
        {
            userId: user.id,
            assetId: createdAssets["ethereum"],
            type: TransactionType.BUY,
            quantity: "2.0",
            pricePerUnit: "2100.00",
            totalAmount: "4200.00",
            currency: Currency.USD,
            createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        },
        {
            userId: user.id,
            assetId: createdAssets["ethereum"],
            type: TransactionType.BUY,
            quantity: "1.2",
            pricePerUnit: "2350.00",
            totalAmount: "2820.00",
            currency: Currency.USD,
            createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        },
        // SOL purchase
        {
            userId: user.id,
            assetId: createdAssets["solana"],
            type: TransactionType.BUY,
            quantity: "150.0",
            pricePerUnit: "95.00",
            totalAmount: "14250.00",
            currency: Currency.USD,
            createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        },
        // ADA purchase
        {
            userId: user.id,
            assetId: createdAssets["cardano"],
            type: TransactionType.BUY,
            quantity: "5000.0",
            pricePerUnit: "0.45",
            totalAmount: "2250.00",
            currency: Currency.USD,
            createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        },
        // BNB purchase
        {
            userId: user.id,
            assetId: createdAssets["binancecoin"],
            type: TransactionType.BUY,
            quantity: "2.0",
            pricePerUnit: "310.00",
            totalAmount: "620.00",
            currency: Currency.USD,
            createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        },
        // A sale
        {
            userId: user.id,
            assetId: createdAssets["ethereum"],
            type: TransactionType.SELL,
            quantity: "0.5",
            pricePerUnit: "2500.00",
            totalAmount: "1250.00",
            currency: Currency.USD,
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        },
        // More deposits
        {
            userId: user.id,
            type: TransactionType.DEPOSIT_USD,
            totalAmount: "5000.00",
            currency: Currency.USD,
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        },
    ];

    for (const tx of transactions) {
        await prisma.transaction.create({ data: tx });
    }

    console.log("✅ Seed complete!");
    console.log(`   - User: ${user.email}`);
    console.log(`   - Positions: 5 assets`);
    console.log(`   - Transactions: ${transactions.length}`);
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
