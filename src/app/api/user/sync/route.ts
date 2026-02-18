import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            // Get Clerk user data
            const clerkUser = await currentUser();
            if (!clerkUser) {
                return NextResponse.json(
                    { success: false, error: "Could not fetch user data" },
                    { status: 500 }
                );
            }

            // Create user + portfolio
            user = await prisma.user.create({
                data: {
                    clerkId,
                    email:
                        clerkUser.emailAddresses[0]?.emailAddress || "unknown@email.com",
                    firstName: clerkUser.firstName,
                    lastName: clerkUser.lastName,
                    portfolio: {
                        create: {
                            name: "Mi Portfolio",
                        },
                    },
                },
            });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        console.error("User sync error:", error);
        return NextResponse.json(
            { success: false, error: "Error syncing user" },
            { status: 500 }
        );
    }
}
