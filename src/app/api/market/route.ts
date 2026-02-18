import { NextResponse } from "next/server";
import { getMarketData } from "@/services/market.service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const perPage = parseInt(searchParams.get("per_page") || "50");

        const data = await getMarketData(page, perPage);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Market API error:", error);
        return NextResponse.json(
            { success: false, error: "Error fetching market data" },
            { status: 500 }
        );
    }
}
