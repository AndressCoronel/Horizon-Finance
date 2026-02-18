"use client";

import { useDemoAdvisor } from "@/hooks/use-demo-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Bot,
    Shield,
    TrendingUp,
    PieChart,
    AlertTriangle,
    Info,
    AlertCircle,
    CheckCircle,
    Lightbulb,
} from "lucide-react";

function ScoreRing({
    score,
    label,
    size = 80,
}: {
    score: number;
    label: string;
    size?: number;
}) {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;
    const color =
        score >= 80
            ? "text-profit"
            : score >= 50
                ? "text-amber-500"
                : "text-loss";

    return (
        <div className="flex flex-col items-center gap-2">
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    className="text-muted/20"
                    strokeWidth={4}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    className={color}
                    strokeWidth={4}
                    strokeDasharray={`${progress} ${circumference - progress}`}
                    strokeLinecap="round"
                />
            </svg>
            <div className="text-center -mt-[calc(50%+12px)]">
                <p className={`text-lg font-bold ${color}`}>{score}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">{label}</p>
        </div>
    );
}

const alertIcons = {
    warning: AlertTriangle,
    info: Info,
    danger: AlertCircle,
    success: CheckCircle,
};

const alertColors = {
    warning:
        "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    danger: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
    success:
        "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
};

const riskColors = {
    bajo: "bg-profit/10 text-profit",
    medio: "bg-amber-500/10 text-amber-500",
    alto: "bg-loss/10 text-loss",
};

export default function DemoAdvisorPage() {
    const { data: advisor, isLoading } = useDemoAdvisor();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Advisor IA
                </h1>
                <p className="text-muted-foreground mt-1">
                    Análisis inteligente y recomendaciones personalizadas
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-60 w-full" />
                    <Skeleton className="h-60 w-full" />
                </div>
            ) : advisor ? (
                <>
                    {/* Scores */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="h-5 w-5 text-primary" />
                                Puntuación General
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
                                <ScoreRing
                                    score={advisor.overallScore}
                                    label="Overall"
                                    size={90}
                                />
                                <ScoreRing
                                    score={advisor.diversificationScore}
                                    label="Diversificación"
                                />
                                <ScoreRing score={advisor.riskScore} label="Riesgo" />
                                <ScoreRing
                                    score={advisor.performanceScore}
                                    label="Rendimiento"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alerts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                Alertas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {advisor.alerts.map((alert, i) => {
                                const Icon =
                                    alertIcons[alert.type as keyof typeof alertIcons] || Info;
                                const colorClass =
                                    alertColors[alert.type as keyof typeof alertColors] ||
                                    alertColors.info;
                                return (
                                    <div
                                        key={i}
                                        className={`flex gap-3 p-4 rounded-lg border ${colorClass}`}
                                    >
                                        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm">{alert.title}</p>
                                            <p className="text-sm opacity-80 mt-0.5">
                                                {alert.message}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-amber-500" />
                                Recomendaciones
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {advisor.recommendations.map((rec, i) => (
                                    <li key={i} className="flex gap-3 items-start">
                                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm text-muted-foreground">{rec}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Asset Analysis */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-primary" />
                                Análisis por Activo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                                                Activo
                                            </th>
                                            <th className="text-center py-3 px-2 text-muted-foreground font-medium">
                                                Riesgo
                                            </th>
                                            <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                                                P&L
                                            </th>
                                            <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                                                Recomendación
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {advisor.assetAnalysis.map((asset) => (
                                            <tr
                                                key={asset.symbol}
                                                className="border-b border-border/50"
                                            >
                                                <td className="py-3 px-2">
                                                    <div>
                                                        <p className="font-medium">{asset.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {asset.symbol}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 text-center">
                                                    <Badge
                                                        variant="secondary"
                                                        className={
                                                            riskColors[
                                                            asset.riskLevel as keyof typeof riskColors
                                                            ] || ""
                                                        }
                                                    >
                                                        {asset.riskLevel}
                                                    </Badge>
                                                </td>
                                                <td
                                                    className={`py-3 px-2 text-right font-medium ${asset.profitLoss >= 0 ? "text-profit" : "text-loss"
                                                        }`}
                                                >
                                                    {asset.profitLoss >= 0 ? "+" : ""}
                                                    {asset.profitLoss.toFixed(2)}%
                                                </td>
                                                <td className="py-3 px-2 text-sm text-muted-foreground">
                                                    {asset.recommendation}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No se pudo cargar el análisis.
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
