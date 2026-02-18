"use client";

import { useAdvisor } from "@/hooks/use-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
    Bot,
    Shield,
    TrendingUp,
    PieChart,
    AlertTriangle,
    AlertCircle,
    Info,
    CheckCircle2,
    Target,
    Activity,
} from "lucide-react";
import type { AlertSeverity, BadgeType, RiskLevel } from "@/types";

const severityConfig: Record<
    AlertSeverity,
    { icon: React.ElementType; color: string }
> = {
    danger: { icon: AlertTriangle, color: "text-loss bg-loss/10 border-loss/20" },
    warning: {
        icon: AlertCircle,
        color: "text-warning-soft bg-warning-soft/10 border-warning-soft/20",
    },
    info: {
        icon: Info,
        color: "text-horizon-blue bg-horizon-blue/10 border-horizon-blue/20",
    },
};

const badgeLabels: Record<BadgeType, { label: string; color: string }> = {
    diversified: { label: "Diversificado", color: "bg-profit/10 text-profit border-profit/20" },
    concentrated: { label: "Concentrado", color: "bg-loss/10 text-loss border-loss/20" },
    conservative: { label: "Conservador", color: "bg-horizon-blue/10 text-horizon-blue border-horizon-blue/20" },
    aggressive: { label: "Agresivo", color: "bg-loss/10 text-loss border-loss/20" },
    balanced: { label: "Balanceado", color: "bg-profit/10 text-profit border-profit/20" },
};

const riskColors: Record<RiskLevel, string> = {
    low: "text-profit",
    medium: "text-warning-soft",
    high: "text-loss",
};

const riskLabels: Record<RiskLevel, string> = {
    low: "Bajo",
    medium: "Medio",
    high: "Alto",
};

function ScoreCircle({
    score,
    label,
    icon: Icon,
}: {
    score: number;
    label: string;
    icon: React.ElementType;
}) {
    const getColor = (s: number) => {
        if (s >= 70) return "text-profit";
        if (s >= 40) return "text-warning-soft";
        return "text-loss";
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="fill-none stroke-muted"
                        strokeWidth="8"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className={`fill-none ${getColor(score)}`}
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${(score / 100) * 264} 264`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Icon className={`h-4 w-4 ${getColor(score)} mb-0.5`} />
                    <span className={`text-lg font-bold ${getColor(score)}`}>
                        {score}
                    </span>
                </div>
            </div>
            <span className="text-xs text-muted-foreground font-medium">{label}</span>
        </div>
    );
}

export default function AdvisorPage() {
    const { data: report, isLoading } = useAdvisor();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Bot className="h-7 w-7 text-primary" />
                        Advisor IA
                    </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardContent className="pt-6">
                                <Skeleton className="h-32 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Bot className="h-7 w-7 text-primary" />
                    Advisor IA
                </h1>
                <p className="text-muted-foreground mt-1">
                    Análisis de riesgo y recomendaciones para tu portfolio
                </p>
            </div>

            {/* Scores */}
            <Card className="glow-primary">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap justify-center gap-8 py-4">
                        <ScoreCircle
                            score={report.healthScore}
                            label="Salud General"
                            icon={Activity}
                        />
                        <ScoreCircle
                            score={report.diversificationScore}
                            label="Diversificación"
                            icon={PieChart}
                        />
                        <ScoreCircle
                            score={100 - report.riskScore}
                            label="Seguridad"
                            icon={Shield}
                        />
                        <ScoreCircle
                            score={report.performanceScore}
                            label="Rendimiento"
                            icon={TrendingUp}
                        />
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {report.badges.map((badge) => {
                            const config = badgeLabels[badge];
                            return (
                                <Badge
                                    key={badge}
                                    variant="outline"
                                    className={`${config.color} text-xs`}
                                >
                                    {config.label}
                                </Badge>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-primary" />
                            Alertas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {report.alerts.length === 0 ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                                <CheckCircle2 className="h-5 w-5 text-profit" />
                                No hay alertas para tu portfolio
                            </div>
                        ) : (
                            report.alerts.map((alert) => {
                                const config = severityConfig[alert.severity];
                                const AlertIcon = config.icon;
                                return (
                                    <div
                                        key={alert.id}
                                        className={`flex gap-3 p-3 rounded-lg border ${config.color}`}
                                    >
                                        <AlertIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">{alert.title}</p>
                                            <p className="text-xs opacity-90 mt-0.5">
                                                {alert.message}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Recomendaciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {report.recommendations.length === 0 ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                                <CheckCircle2 className="h-5 w-5 text-profit" />
                                ¡Tu portfolio se ve bien!
                            </div>
                        ) : (
                            report.recommendations.map((rec) => (
                                <div
                                    key={rec.id}
                                    className="p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                                >
                                    <p className="text-sm font-medium">{rec.title}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {rec.description}
                                    </p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Asset Risk Analysis */}
            {report.assetRisks.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Análisis de Riesgo por Activo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {report.assetRisks.map((asset) => (
                                <div key={asset.symbol} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {asset.symbol.toUpperCase()}
                                            </span>
                                            <span className="text-muted-foreground text-xs">
                                                {asset.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-muted-foreground">
                                                {asset.allocation.toFixed(1)}% del portfolio
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] ${riskColors[asset.riskLevel]}`}
                                            >
                                                Riesgo {riskLabels[asset.riskLevel]}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress
                                        value={asset.allocation}
                                        className="h-2"
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Timestamp */}
            <p className="text-xs text-muted-foreground text-center">
                Informe generado el{" "}
                {new Date(report.generatedAt).toLocaleString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </p>
        </div>
    );
}
