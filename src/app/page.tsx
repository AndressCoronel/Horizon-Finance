import Link from "next/link";
import {
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Bot,
  ArrowRight,
  Globe,
  Wallet,
  LineChart,
  Lock,
  Activity,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BarChart3,
    title: "Dashboard Inteligente",
    description:
      "Visualizá tu patrimonio total, distribución de activos y rendimiento en tiempo real con gráficos interactivos.",
    gradient: "from-blue-500/20 to-purple-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Globe,
    title: "Market Explorer",
    description:
      "Explorá las top 50+ criptomonedas con precios actualizados, rankings y tendencias directamente desde CoinGecko.",
    gradient: "from-emerald-500/20 to-cyan-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: Zap,
    title: "Trading Simulado",
    description:
      "Comprá y vendé criptomonedas sin riesgo. Sistema completo con validaciones, historial y precio promedio ponderado.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
  },
  {
    icon: Bot,
    title: "Advisor IA",
    description:
      "Motor de análisis que evalúa riesgo, diversificación y rendimiento para generar recomendaciones personalizadas.",
    gradient: "from-violet-500/20 to-pink-500/20",
    iconColor: "text-violet-500",
  },
  {
    icon: Wallet,
    title: "Multi-Moneda",
    description:
      "Fondos en USD y ARS con cotización del dólar blue en tiempo real. Depósitos instantáneos en ambas monedas.",
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-500",
  },
  {
    icon: Shield,
    title: "Seguridad Enterprise",
    description:
      "Auth con Clerk, validaciones con Zod, transacciones atómicas con Prisma. Arquitectura de producción real.",
    gradient: "from-rose-500/20 to-red-500/20",
    iconColor: "text-rose-500",
  },
];

const stats = [
  { value: "50+", label: "Criptomonedas" },
  { value: "Real-Time", label: "Cotizaciones" },
  { value: "$0", label: "Costo Total" },
  { value: "100%", label: "Open Source" },
];

const techStack = [
  { name: "Next.js 15", category: "Framework" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Prisma", category: "ORM" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Clerk", category: "Auth" },
  { name: "TanStack Query", category: "State" },
  { name: "Recharts", category: "Charts" },
  { name: "Shadcn/ui", category: "Components" },
  { name: "Supabase", category: "Cloud DB" },
  { name: "Zod", category: "Validation" },
  { name: "Vercel", category: "Deploy" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-horizon-blue to-horizon-purple flex items-center justify-center animate-glow-pulse">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold gradient-text">Horizon</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1.5 font-medium">
                  Finance
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="sm"
                  className="gap-1.5 bg-gradient-to-r from-horizon-blue to-horizon-purple hover:opacity-90 transition-opacity border-0"
                >
                  Empezar
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          {/* Grid */}
          <div className="absolute inset-0 bg-grid bg-grid-fade" />

          {/* Aurora */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] aurora opacity-40" />

          {/* Floating orbs */}
          <div className="absolute top-1/4 left-[15%] w-72 h-72 bg-horizon-blue/15 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-[15%] w-80 h-80 bg-horizon-purple/12 rounded-full blur-3xl animate-float-delay" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-horizon-cyan/10 rounded-full blur-3xl animate-float-slow" />

          {/* Subtle particles */}
          <div className="absolute top-20 left-[10%] w-1 h-1 bg-horizon-blue/40 rounded-full animate-float" />
          <div className="absolute top-40 right-[20%] w-1.5 h-1.5 bg-horizon-purple/30 rounded-full animate-float-slow" />
          <div className="absolute bottom-40 left-[30%] w-1 h-1 bg-horizon-cyan/40 rounded-full animate-float-delay" />
          <div className="absolute top-60 left-[60%] w-2 h-2 bg-horizon-blue/20 rounded-full animate-float" />
          <div className="absolute bottom-60 right-[40%] w-1 h-1 bg-profit/30 rounded-full animate-float-slow" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-up opacity-0 inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-border glass-card mb-10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-profit opacity-75 live-pulse" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-profit" />
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              Datos de mercado en tiempo real
            </span>
            <Sparkles className="h-3.5 w-3.5 text-horizon-blue" />
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up opacity-0 animate-delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
            Gestioná tus inversiones
            <br />
            <span className="gradient-text">como un profesional</span>
          </h1>

          {/* Subheading */}
          <p className="animate-fade-up opacity-0 animate-delay-200 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Plataforma de inversiones en criptomonedas con trading simulado,
            análisis de portfolio en tiempo real y{" "}
            <span className="text-foreground font-medium">
              asesor financiero inteligente
            </span>
            .
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-up opacity-0 animate-delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base gap-2.5 px-8 h-12 bg-gradient-to-r from-horizon-blue to-horizon-purple hover:opacity-90 transition-all border-0 shadow-lg shadow-horizon-blue/25 animate-glow-pulse"
              >
                Empezar Gratis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base gap-2.5 px-8 h-12 glass-card"
              >
                <Activity className="h-5 w-5" />
                Ver Demo en Vivo
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-fade-up opacity-0 animate-delay-500 flex flex-wrap justify-center gap-8 sm:gap-16">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text stat-number">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in opacity-0 animate-delay-1000">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-muted-foreground/50 animate-float" />
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card mb-6">
              <LineChart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Funcionalidades
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
              Todo lo que necesitás para{" "}
              <span className="gradient-text">invertir inteligente</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Herramientas profesionales de inversión, diseñadas con las mejores
              prácticas de la industria fintech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative glass-card rounded-xl p-7 overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon
                      className={`h-6 w-6 ${feature.iconColor}`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2.5">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Corner decoration */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DASHBOARD PREVIEW ===== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
              Dashboard{" "}
              <span className="gradient-text">de nivel institucional</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Interfaz moderna con datos en tiempo real, gráficos interactivos y
              métricas clave a primera vista.
            </p>
          </div>

          {/* Mock Dashboard Preview */}
          <div className="relative">
            {/* Glow behind */}
            <div className="absolute inset-0 bg-gradient-to-r from-horizon-blue/20 via-horizon-purple/20 to-horizon-cyan/20 blur-3xl -z-10 scale-95" />

            <div className="glass-card rounded-2xl p-1 border-gradient shadow-2xl">
              <div className="bg-card rounded-xl overflow-hidden">
                {/* Mock Topbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-loss/60" />
                    <div className="w-3 h-3 rounded-full bg-warning-soft/60" />
                    <div className="w-3 h-3 rounded-full bg-profit/60" />
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    horizon-finance.vercel.app/dashboard
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3 text-profit" />
                    <span className="text-xs text-profit font-medium">
                      Secured
                    </span>
                  </div>
                </div>

                {/* Mock Dashboard Content */}
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                      {
                        label: "Patrimonio Total",
                        value: "$147,832.50",
                        change: "+12.4%",
                        positive: true,
                      },
                      {
                        label: "Portfolio Value",
                        value: "$132,832.50",
                        change: "5 activos",
                        tag: true,
                      },
                      {
                        label: "Ganancia / Pérdida",
                        value: "+$18,452.30",
                        change: "+16.1%",
                        positive: true,
                      },
                      {
                        label: "Saldo Disponible",
                        value: "$15,000.00",
                        change: "$5M ARS",
                        tag: true,
                      },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="p-4 rounded-xl border border-border bg-accent/30"
                      >
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
                          {card.label}
                        </p>
                        <p
                          className={`text-sm sm:text-lg font-bold ${card.positive ? "text-profit" : ""
                            }`}
                        >
                          {card.value}
                        </p>
                        <p
                          className={`text-[10px] sm:text-xs mt-1 ${card.positive
                            ? "text-profit"
                            : card.tag
                              ? "text-muted-foreground"
                              : ""
                            }`}
                        >
                          {card.change}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Mock chart area */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 h-40 sm:h-48 rounded-xl border border-border bg-accent/20 flex items-end p-4 gap-1">
                      {[40, 55, 45, 70, 60, 80, 65, 90, 75, 95, 85, 100].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-horizon-blue/60 to-horizon-purple/40"
                            style={{ height: `${h}%` }}
                          />
                        )
                      )}
                    </div>
                    <div className="h-40 sm:h-48 rounded-xl border border-border bg-accent/20 p-4 flex flex-col justify-center items-center">
                      {/* Mini donut */}
                      <svg
                        viewBox="0 0 36 36"
                        className="w-20 h-20 sm:w-24 sm:h-24"
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="currentColor"
                          className="text-muted/30"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          strokeWidth="3"
                          strokeDasharray="35 65"
                          strokeDashoffset="25"
                          className="text-horizon-blue"
                          stroke="currentColor"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          strokeWidth="3"
                          strokeDasharray="25 75"
                          strokeDashoffset="-10"
                          className="text-horizon-purple"
                          stroke="currentColor"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          strokeWidth="3"
                          strokeDasharray="20 80"
                          strokeDashoffset="-35"
                          className="text-horizon-cyan"
                          stroke="currentColor"
                          strokeLinecap="round"
                        />
                      </svg>
                      <p className="text-xs text-muted-foreground mt-2">
                        Distribución
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ARCHITECTURE / TECH STACK ===== */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Stack Tecnológico
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5">
              Construido con{" "}
              <span className="gradient-text">tecnología de vanguardia</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Cada pieza elegida por su rendimiento, developer experience y
              escalabilidad.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="group glass-card rounded-xl px-4 py-4 text-center"
              >
                <p className="font-semibold text-sm group-hover:gradient-text transition-colors">
                  {tech.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium">
                  {tech.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-horizon-blue/5 to-transparent" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-horizon-blue/10 via-horizon-purple/10 to-horizon-cyan/10 rounded-full blur-2xl" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-horizon-blue to-horizon-purple flex items-center justify-center animate-glow-pulse">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Empezá a invertir
            <br />
            <span className="gradient-text">hoy mismo</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Creá tu cuenta gratuita y comenzá a gestionar tu portfolio de
            inversiones como un profesional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base gap-2.5 px-10 h-13 bg-gradient-to-r from-horizon-blue to-horizon-purple hover:opacity-90 transition-all border-0 shadow-lg shadow-horizon-blue/25 animate-glow-pulse"
              >
                Crear Cuenta Gratis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Sin tarjeta de crédito • 100% gratuito • Datos de mercado en tiempo real
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-horizon-blue to-horizon-purple flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold gradient-text">
              Horizon Finance
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>
              Portfolio project — Built with ❤️ by Andrés
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
