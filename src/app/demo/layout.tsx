"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Globe,
    ArrowLeftRight,
    PieChart,
    Receipt,
    Bot,
    TrendingUp,
    LogIn,
    Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

const demoNavItems = [
    { href: "/demo/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/demo/market", label: "Mercado", icon: Globe },
    { href: "/demo/trade", label: "Trading", icon: ArrowLeftRight },
    { href: "/demo/portfolio", label: "Portfolio", icon: PieChart },
    { href: "/demo/transactions", label: "Transacciones", icon: Receipt },
    { href: "/demo/advisor", label: "Advisor IA", icon: Bot },
];

function DemoSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 border-r border-border bg-sidebar min-h-screen p-4">
            {/* Brand */}
            <Link href="/demo/dashboard" className="flex items-center gap-3 px-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-horizon-blue to-horizon-purple flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                    <span className="text-lg font-bold gradient-text">Horizon</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1.5 font-medium">
                        Finance
                    </span>
                </div>
            </Link>

            {/* Demo Badge */}
            <div className="mx-2 mb-6 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                        Modo Demo
                    </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                    Datos de ejemplo • Solo lectura
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {demoNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="space-y-3 pt-4 border-t border-border">
                <ThemeToggle />
                <Link href="/sign-up" className="block">
                    <Button
                        size="sm"
                        className="w-full gap-2 bg-gradient-to-r from-horizon-blue to-horizon-purple hover:opacity-90 border-0"
                    >
                        <LogIn className="h-4 w-4" />
                        Crear Cuenta
                    </Button>
                </Link>
                <Link href="/">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                        ← Volver al inicio
                    </Button>
                </Link>
            </div>
        </aside>
    );
}

function DemoMobileNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-sidebar">
                <Link href="/demo/dashboard" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-horizon-blue to-horizon-purple flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold gradient-text">Horizon</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        DEMO
                    </span>
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Link href="/sign-up">
                        <Button
                            size="sm"
                            className="gap-1 text-xs bg-gradient-to-r from-horizon-blue to-horizon-purple hover:opacity-90 border-0"
                        >
                            <LogIn className="h-3 w-3" />
                            Registrarse
                        </Button>
                    </Link>
                </div>
            </div>
            {/* Bottom tab bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-sidebar/95 backdrop-blur-lg px-2 py-2">
                {demoNavItems.slice(0, 5).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-[10px]">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <DemoSidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <DemoMobileNav />
                <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-8 max-w-[1600px] mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
