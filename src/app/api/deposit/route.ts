import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { executeDeposit } from "@/services/trading.service";
import { depositSchema } from "@/lib/validators";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const parsed = depositSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: parsed.error.issues[0]?.message || "Datos inválidos",
                },
                { status: 400 }
            );
        }

        const result = await executeDeposit(userId, parsed.data);
        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Error al depositar";
        console.error("Deposit API error:", error);
        return NextResponse.json(
            { success: false, error: message },
            { status: 400 }
        );
    }
}
