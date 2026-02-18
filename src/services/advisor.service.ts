import type {
    PortfolioSummary,
    AdvisorReport,
    AdvisorAlert,
    AdvisorRecommendation,
    AssetRiskAnalysis,
    BadgeType,
    RiskLevel,
} from "@/types";

function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

function classifyVolatility(change: number): RiskLevel {
    const abs = Math.abs(change);
    if (abs < 5) return "low";
    if (abs < 15) return "medium";
    return "high";
}

function calculateDiversificationScore(
    summary: PortfolioSummary
): number {
    const { positions } = summary;
    if (positions.length === 0) return 0;

    let score = 0;

    // Factor 1: Number of assets (max 40 points)
    if (positions.length >= 7) score += 40;
    else if (positions.length >= 5) score += 30;
    else if (positions.length >= 3) score += 20;
    else score += 10;

    // Factor 2: Balance of allocations (max 60 points)
    // Perfect balance = 100/n per asset
    const idealAllocation = 100 / positions.length;
    const deviations = positions.map((p) =>
        Math.abs(p.allocation - idealAllocation)
    );
    const avgDeviation =
        deviations.reduce((a, b) => a + b, 0) / deviations.length;

    // Less deviation = higher score
    const balanceScore = Math.max(0, 60 - avgDeviation * 1.5);
    score += balanceScore;

    return Math.min(100, Math.round(score));
}

function calculateRiskScore(
    assetRisks: AssetRiskAnalysis[]
): number {
    if (assetRisks.length === 0) return 0;

    // Weighted average risk by allocation
    const weightedRisk = assetRisks.reduce((total, asset) => {
        const riskValue =
            asset.riskLevel === "high" ? 90 : asset.riskLevel === "medium" ? 50 : 20;
        return total + riskValue * (asset.allocation / 100);
    }, 0);

    return Math.round(weightedRisk);
}

function calculatePerformanceScore(
    summary: PortfolioSummary
): number {
    const { totalProfitLossPercentage } = summary;

    // Map P&L % to a 0-100 score
    if (totalProfitLossPercentage >= 50) return 100;
    if (totalProfitLossPercentage >= 25) return 85;
    if (totalProfitLossPercentage >= 10) return 70;
    if (totalProfitLossPercentage >= 0) return 55;
    if (totalProfitLossPercentage >= -10) return 40;
    if (totalProfitLossPercentage >= -25) return 25;
    return 10;
}

export function generateAdvisorReport(
    summary: PortfolioSummary
): AdvisorReport {
    const { positions } = summary;
    const alerts: AdvisorAlert[] = [];
    const recommendations: AdvisorRecommendation[] = [];

    if (positions.length === 0) {
        return {
            healthScore: 0,
            diversificationScore: 0,
            riskScore: 0,
            performanceScore: 0,
            badges: [],
            alerts: [
                {
                    id: generateId(),
                    severity: "info",
                    title: "Portfolio vacío",
                    message:
                        "Todavía no tenés activos. Depositá fondos y comprá tu primera cripto para comenzar.",
                    icon: "info",
                },
            ],
            recommendations: [
                {
                    id: generateId(),
                    title: "Comenzá a invertir",
                    description:
                        "Depositá fondos en tu cuenta y comprá tu primera criptomoneda. Te recomendamos comenzar con activos de alta capitalización como BTC o ETH.",
                    type: "general",
                },
            ],
            assetRisks: [],
            generatedAt: new Date().toISOString(),
        };
    }

    // ========== Asset Risk Analysis ==========
    const assetRisks: AssetRiskAnalysis[] = positions.map((pos) => ({
        symbol: pos.symbol,
        name: pos.name,
        volatility24h: Math.abs(pos.priceChange24h),
        volatility7d: 0, // would need 7d data
        riskLevel: classifyVolatility(pos.priceChange24h),
        allocation: pos.allocation,
    }));

    // ========== Diversification Alerts ==========
    const topPosition = positions[0];
    if (topPosition && topPosition.allocation > 60) {
        alerts.push({
            id: generateId(),
            severity: "danger",
            title: "Alta concentración",
            message: `El ${topPosition.allocation.toFixed(1)}% de tu portfolio está en ${topPosition.symbol}. Se recomienda no superar el 40% en un solo activo.`,
            icon: "alert-triangle",
        });
        recommendations.push({
            id: generateId(),
            title: `Reducí tu exposición a ${topPosition.symbol}`,
            description: `Considerá diversificar vendiendo parte de tu posición en ${topPosition.symbol} e invirtiendo en otros activos para reducir el riesgo.`,
            type: "diversification",
        });
    } else if (topPosition && topPosition.allocation > 40) {
        alerts.push({
            id: generateId(),
            severity: "warning",
            title: "Concentración moderada",
            message: `${topPosition.symbol} representa el ${topPosition.allocation.toFixed(1)}% de tu portfolio. Considerá diversificar un poco más.`,
            icon: "alert-circle",
        });
    }

    // Check if top 2 assets > 70%
    if (positions.length >= 2) {
        const top2Allocation = positions[0].allocation + positions[1].allocation;
        if (top2Allocation > 80) {
            alerts.push({
                id: generateId(),
                severity: "warning",
                title: "Portfolio poco diversificado",
                message: `Tus 2 principales activos (${positions[0].symbol} y ${positions[1].symbol}) representan el ${top2Allocation.toFixed(1)}% del total.`,
                icon: "pie-chart",
            });
        }
    }

    if (positions.length < 3) {
        recommendations.push({
            id: generateId(),
            title: "Agregá más activos",
            description:
                "Tener al menos 3-5 criptomonedas distintas puede reducir significativamente el riesgo de tu portfolio.",
            type: "diversification",
        });
    }

    // ========== Volatility Alerts ==========
    const highVolatilityAssets = assetRisks.filter(
        (a) => a.riskLevel === "high"
    );
    if (highVolatilityAssets.length > 0) {
        const names = highVolatilityAssets.map((a) => a.symbol).join(", ");
        const totalHighAlloc = highVolatilityAssets.reduce(
            (s, a) => s + a.allocation,
            0
        );

        alerts.push({
            id: generateId(),
            severity: totalHighAlloc > 50 ? "danger" : "warning",
            title: "Activos de alta volatilidad",
            message: `${names} ${highVolatilityAssets.length > 1 ? "muestran" : "muestra"} alta volatilidad (>15% en 24h). Representan el ${totalHighAlloc.toFixed(1)}% de tu portfolio.`,
            icon: "trending-up",
        });

        if (totalHighAlloc > 50) {
            recommendations.push({
                id: generateId(),
                title: "Reducí exposición a activos volátiles",
                description:
                    "Más de la mitad de tu portfolio está en activos de alta volatilidad. Considerá mover parte a activos más estables.",
                type: "risk",
            });
        }
    }

    // ========== Performance Alerts ==========
    positions.forEach((pos) => {
        if (pos.profitLossPercentage > 50) {
            recommendations.push({
                id: generateId(),
                title: `Considerá tomar ganancias en ${pos.symbol}`,
                description: `Tu posición en ${pos.symbol} tiene un +${pos.profitLossPercentage.toFixed(1)}% de ganancia. Podrías considerar vender una parte para asegurar beneficios.`,
                type: "performance",
            });
        } else if (pos.profitLossPercentage < -30) {
            alerts.push({
                id: generateId(),
                severity: "warning",
                title: `Pérdida significativa en ${pos.symbol}`,
                message: `Tu posición en ${pos.symbol} tiene un ${pos.profitLossPercentage.toFixed(1)}% de pérdida. Evaluá si mantener o cortar la posición.`,
                icon: "trending-down",
            });
        }
    });

    // ========== Positive Alerts ==========
    if (summary.totalProfitLossPercentage > 0) {
        alerts.push({
            id: generateId(),
            severity: "info",
            title: "Portfolio en ganancia",
            message: `Tu portfolio muestra un rendimiento positivo de +${summary.totalProfitLossPercentage.toFixed(2)}%. ¡Buen trabajo!`,
            icon: "check-circle",
        });
    }

    // ========== Calculate Scores ==========
    const diversificationScore = calculateDiversificationScore(summary);
    const riskScore = calculateRiskScore(assetRisks);
    const performanceScore = calculatePerformanceScore(summary);

    // Health score = weighted average
    const healthScore = Math.round(
        diversificationScore * 0.3 +
        (100 - riskScore) * 0.3 +
        performanceScore * 0.4
    );

    // ========== Badges ==========
    const badges: BadgeType[] = [];
    if (diversificationScore >= 60) badges.push("diversified");
    else badges.push("concentrated");

    if (riskScore >= 70) badges.push("aggressive");
    else if (riskScore <= 30) badges.push("conservative");
    else badges.push("balanced");

    return {
        healthScore,
        diversificationScore,
        riskScore,
        performanceScore,
        badges,
        alerts,
        recommendations,
        assetRisks,
        generatedAt: new Date().toISOString(),
    };
}
