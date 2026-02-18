import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const type = searchParams.get("type"); // BUY, SELL, DEPOSIT_USD, DEPOSIT_ARS

        const user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const where: Record<string, unknown> = { userId: user.id };
        if (type) {
            where.type = type;
        }

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                include: {
                    asset: {
                        select: {
                            symbol: true,
                            name: true,
                            image: true,
                            coinGeckoId: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.transaction.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                transactions: transactions.map((t) => ({
                    id: t.id,
                    type: t.type,
                    quantity: t.quantity ? Number(t.quantity) : null,
                    pricePerUnit: t.pricePerUnit ? Number(t.pricePerUnit) : null,
                    totalAmount: Number(t.totalAmount),
                    currency: t.currency,
                    asset: t.asset,
                    createdAt: t.createdAt.toISOString(),
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error("Transactions API error:", error);
        return NextResponse.json(
            { success: false, error: "Error fetching transactions" },
            { status: 500 }
        );
    }
}
