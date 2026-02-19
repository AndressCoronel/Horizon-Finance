
import Link from "next/link";
import { ArrowRight, Globe, TrendingUp, ShieldCheck, Zap, Activity, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 h-16 divide-x divide-border border-x border-border">
          <div className="col-span-3 lg:col-span-2 flex items-center px-6">
            <span className="text-xl font-bold tracking-tighter uppercase">Horizon<span className="text-accent">.</span></span>
          </div>
          <div className="col-span-6 lg:col-span-8 hidden md:flex items-center px-6 gap-8 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Plataforma</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Mercados</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Empresas</Link>
          </div>
          <div className="col-span-9 md:col-span-3 lg:col-span-2 flex items-center justify-end px-6 gap-4">
            <Link href="/sign-in" className="text-sm font-medium hover:underline underline-offset-4">Ingresar</Link>
            <Link href="/sign-up">
              <Button className="bg-primary text-primary-foreground hover:bg-accent hover:text-white rounded-none border border-transparent transition-all uppercase text-xs tracking-widest font-bold px-6">
                Comenzar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="pt-16 min-h-screen flex flex-col border-b border-border">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 max-w-[1600px] mx-auto w-full border-x border-border divide-y lg:divide-y-0 lg:divide-x divide-border">

          {/* Left Column: Typography */}
          <div className="flex flex-col justify-center px-6 py-20 lg:p-20 relative overflow-hidden bg-grid">
            <div className="absolute top-6 left-6 text-xs uppercase tracking-widest text-muted-foreground border border-border px-2 py-1 bg-background">
              SISTEMA FINANCIERO v2.0
            </div>

            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-8">
              CON<br />TROL DE<br />
              CAPI<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">TAL</span>
            </h1>

            <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-md border-l-4 border-accent pl-6 mb-12">
              La plataforma de grado institucional para el inversor moderno. Precisión, velocidad e inteligencia en una interfaz unificada.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="rounded-none h-14 px-8 text-base bg-foreground text-background hover:bg-accent border border-transparent transition-all">
                  Abrir Cuenta <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo/dashboard">
                <Button variant="outline" size="lg" className="rounded-none h-14 px-8 text-base border-2 border-foreground hover:bg-foreground hover:text-background transition-all">
                  Demo en Vivo
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Abstract/Technical Visual */}
          <div className="relative bg-muted/20 flex items-center justify-center overflow-hidden min-h-[500px] lg:min-h-auto group">
            <div className="absolute inset-0 bg-[radial-gradient(#0000001a_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Visual Element */}
            <div className="relative z-10 w-3/4 max-w-md aspect-square border-2 border-foreground bg-background p-4 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2">
              <div className="h-full w-full border border-border flex flex-col">
                {/* Fake UI Header */}
                <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-muted/30">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 border border-foreground bg-transparent rounded-full" />
                    <div className="w-3 h-3 border border-foreground bg-transparent rounded-full" />
                  </div>
                  <span className="font-mono text-xs">TERM_01</span>
                </div>
                {/* Fake UI Body */}
                <div className="flex-1 p-6 font-mono text-sm space-y-4">
                  <div className="flex justify-between border-b border-dashed border-border pb-2">
                    <span className="text-muted-foreground">ASIGNACIÓN_ACTIVOS</span>
                    <span>100%</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { l: "BTC/USD", v: "64,241.50", c: "text-emerald-600" },
                      { l: "ETH/USD", v: "3,421.10", c: "text-emerald-600" },
                      { l: "SOL/USD", v: "148.20", c: "text-red-500" },
                    ].map((i) => (
                      <div key={i.l} className="flex justify-between items-center">
                        <span>{i.l}</span>
                        <div className="flex flex-col items-end text-right">
                          <span className="font-bold">{i.v}</span>
                          <span className={`text-[10px] ${i.c}`}>▲ 2.4%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-8">
                    <div className="h-16 w-full bg-accent/10 border border-accent flex items-center justify-center">
                      <Activity className="text-accent animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TICKER STRIP ===== */}
      <div className="border-b border-border bg-foreground text-background overflow-hidden py-3">
        <div className="animate-marquee whitespace-nowrap flex gap-12 text-sm font-mono font-medium uppercase tracking-widest">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center gap-4">
              <span>MERCADOS EN VIVO</span>
              <span className="text-accent">●</span>
              <span>BTC $64,242</span>
              <span>ETH $3,421</span>
              <span>SOL $148</span>
              <span>NDX 18,440</span>
              <span>SPX 5,200</span>
              <span className="text-accent">●</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== GRID FEATURES ===== */}
      <section className="py-24 max-w-[1600px] mx-auto border-x border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-y border-border">

          {/* Box 1 */}
          <div className="p-12 hover:bg-muted/30 transition-colors group">
            <TrendingUp className="w-12 h-12 mb-8 stroke-1" />
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Analítica</h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Profundizá en el rendimiento de tu portfolio con herramientas de gráficos institucionales y datos en tiempo real.
            </p>
            <Link href="#" className="inline-flex items-center text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 group-hover:text-accent group-hover:border-accent transition-colors">
              Explorar <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Box 2 */}
          <div className="p-12 hover:bg-muted/30 transition-colors group">
            <ShieldCheck className="w-12 h-12 mb-8 stroke-1" />
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Seguridad</h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Encriptación de nivel bancario y autenticación biométrica aseguran que tus activos estén protegidos contra toda amenaza.
            </p>
            <Link href="#" className="inline-flex items-center text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 group-hover:text-accent group-hover:border-accent transition-colors">
              Ver Más <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Box 3 */}
          <div className="p-12 hover:bg-muted/30 transition-colors group">
            <Zap className="w-12 h-12 mb-8 stroke-1" />
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Ejecución</h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Ejecución de operaciones ultrarrápida con acceso directo al mercado y deslizamiento mínimo en todos los exchanges principales.
            </p>
            <Link href="#" className="inline-flex items-center text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 group-hover:text-accent group-hover:border-accent transition-colors">
              Ver Velocidad <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BIG STATS ===== */}
      <section className="border-b border-border bg-foreground text-background">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
          {[
            { l: "Usuarios", v: "50K+" },
            { l: "Volumen", v: "$2B+" },
            { l: "Uptime", v: "99.9%" },
            { l: "Países", v: "140+" }
          ].map((stat) => (
            <div key={stat.l} className="p-12 text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tighter">{stat.v}</div>
              <div className="text-xs uppercase tracking-widest text-white/60">{stat.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-32 px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 max-w-4xl mx-auto leading-[0.9]">
          ¿LISTO PARA <span className="text-accent underline decoration-4 underline-offset-8">DOMINAR</span> EL MERCADO?
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Unite al círculo de élite de inversores que usan Horizon Finance hoy.
        </p>
        <Link href="/sign-up">
          <Button size="lg" className="rounded-none h-16 px-12 text-lg bg-foreground text-background hover:bg-accent border-2 border-transparent transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            Comenzar Ahora
          </Button>
        </Link>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-[1600px] mx-auto p-12 lg:p-20 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold tracking-tighter uppercase">Horizon<span className="text-accent">.</span></span>
            <p className="mt-6 text-muted-foreground max-w-sm">
              Horizon Finance es una empresa de tecnología financiera, no un banco. Servicios bancarios proporcionados por nuestros socios.
            </p>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-6 text-sm">Producto</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Mercados</Link></li>
              <li><Link href="#" className="hover:text-foreground">Exchange</Link></li>
              <li><Link href="#" className="hover:text-foreground">Earn</Link></li>
              <li><Link href="#" className="hover:text-foreground">Institucional</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-6 text-sm">Compañía</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Carreras</Link></li>
              <li><Link href="#" className="hover:text-foreground">Prensa</Link></li>
              <li><Link href="#" className="hover:text-foreground">Legal</Link></li>
              <li><Link href="#" className="hover:text-foreground">Contacto</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border p-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
          © 2024 Horizon Finance Systems. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
