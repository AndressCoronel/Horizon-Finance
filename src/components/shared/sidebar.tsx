"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Globe,
    ArrowLeftRight,
    Wallet,
    ScrollText,
    Bot,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Mercado",
        href: "/market",
        icon: Globe,
    },
    {
        label: "Trading",
        href: "/trade",
        icon: ArrowLeftRight,
    },
    {
        label: "Portfolio",
        href: "/portfolio",
        icon: Wallet,
    },
    {
        label: "Transacciones",
        href: "/transactions",
        icon: ScrollText,
    },
    {
        label: "Advisor IA",
        href: "/advisor",
        icon: Bot,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar min-h-screen">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-horizon-blue to-horizon-purple flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight gradient-text">
                            Horizon
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground -mt-1">
                            Finance
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        pathname?.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                        >
                            <item.icon className="h-4.5 w-4.5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="p-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                    <ThemeToggle />
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "w-8 h-8",
                            },
                        }}
                    />
                </div>
            </div>
        </aside>
    );
}
