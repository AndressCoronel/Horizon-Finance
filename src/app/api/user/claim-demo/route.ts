import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// POST /api/user/claim-demo — Migrates demo data to the current authenticated user
export async function POST() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Find the demo user
        const demoUser = await prisma.user.findUnique({
            where: { clerkId: "demo_user_clerk_id" },
            include: { portfolio: { include: { positions: true } } },
        });

        if (!demoUser) {
            return NextResponse.json(
                { success: false, error: "No demo data found to claim" },
                { status: 404 }
            );
        }

        // Find the current user
        const currentUserRecord = await prisma.user.findUnique({
            where: { clerkId },
            include: { portfolio: true },
        });

        if (!currentUserRecord) {
            return NextResponse.json(
                { success: false, error: "Current user not found. Please refresh the page first." },
                { status: 404 }
            );
        }

        // Transfer demo data: update balances, move portfolio positions & transactions
        await prisma.$transaction(async (tx) => {
            // Update current user balances
            await tx.user.update({
                where: { id: currentUserRecord.id },
                data: {
                    cashBalanceUSD: demoUser.cashBalanceUSD,
                    cashBalanceARS: demoUser.cashBalanceARS,
                },
            });

            // Move positions from demo portfolio to current user's portfolio
            if (demoUser.portfolio && currentUserRecord.portfolio) {
                await tx.position.updateMany({
                    where: { portfolioId: demoUser.portfolio.id },
                    data: { portfolioId: currentUserRecord.portfolio.id },
                });
            }

            // Move transactions from demo user to current user
            await tx.transaction.updateMany({
                where: { userId: demoUser.id },
                data: { userId: currentUserRecord.id },
            });

            // Delete demo user's empty portfolio and then the demo user
            if (demoUser.portfolio) {
                await tx.portfolio.delete({ where: { id: demoUser.portfolio.id } });
            }
            await tx.user.delete({ where: { id: demoUser.id } });
        });

        return NextResponse.json({
            success: true,
            message: "Demo data claimed successfully! Refresh the page to see your portfolio.",
        });
    } catch (error) {
        console.error("Claim demo error:", error);
        return NextResponse.json(
            { success: false, error: "Error claiming demo data" },
            { status: 500 }
        );
    }
}
