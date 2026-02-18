import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getPortfolioSummary } from "@/services/portfolio.service";
import { generateAdvisorReport } from "@/services/advisor.service";

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
        const report = generateAdvisorReport(summary);

        return NextResponse.json({ success: true, data: report });
    } catch (error) {
        console.error("Advisor API error:", error);
        return NextResponse.json(
            { success: false, error: "Error generating advisor report" },
            { status: 500 }
        );
    }
}
