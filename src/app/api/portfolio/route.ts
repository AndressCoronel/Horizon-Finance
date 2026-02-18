import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPortfolioSummary } from "@/services/portfolio.service";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const summary = await getPortfolioSummary(userId);
        return NextResponse.json({ success: true, data: summary });
    } catch (error) {
        console.error("Portfolio API error:", error);
        return NextResponse.json(
            { success: false, error: "Error fetching portfolio" },
            { status: 500 }
        );
    }
}
