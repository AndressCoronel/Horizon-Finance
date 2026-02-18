import { NextResponse } from "next/server";
import { getDolarBlue } from "@/services/market.service";

export async function GET() {
    try {
        const data = await getDolarBlue();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Dolar API error:", error);
        return NextResponse.json(
            { success: false, error: "Error fetching dolar data" },
            { status: 500 }
        );
    }
}
