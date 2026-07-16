import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Cpu, 
  Database, 
  GitBranch, 
  Layers, 
  ShieldCheck, 
  Zap 
} from "lucide-react";

export default function MarketingLandingPage() {
  const features = [
    {
      title: "Model Context Protocol (MCP)",
      desc: "Connect your AI agent to external services like Gmail, Google Calendar, and GitHub through standard, sandboxed protocol servers.",
      icon: Cpu
    },
    {
      title: "FastAPI Connection Pool",
      desc: "Engineered on top of SQLAlchemy 2.0 with connection pre-ping, auto-cleanup, and PostgreSQL pooling to optimize query performance.",
      icon: Database
    },
    {
      title: "Production Ready Architecture",
      desc: "Features structured global logging middlewares and unified error-intercept response formats built to corporate standards.",
      icon: ShieldCheck
    },
    {
      title: "Dockerized Portability",
      desc: "Spin up the entire workspace, database, and background services in one single instruction: `docker compose up --build`.",
      icon: Layers
    },
    {
      title: "Async Execution Pipeline",
      desc: "Built to process instructions concurrently, decoupling the LLM generation loop from file writing and data storage.",
      icon: Zap
    },
    {
      title: "Scale-Out Folder Layout",
      desc: "Organized cleanly into isolated configuration layers, routers, services, schemas, and database migrations folders.",
      icon: GitBranch
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* DECORATIVE LIGHTING GLOWS */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none -z-10" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-md px-6 lg:px-16 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-indigo-600 text-white font-bold">
            F
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            FoundrAI
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/chat" className="text-sm font-medium hover:text-primary transition-colors">
            Assistant Chat
          </Link>
          <Link href="/dashboard" className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all">
            Launch Console <ArrowRight size={12} />
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 lg:py-32 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6 animate-pulse">
          <span>Introducing Phase 3: Frontend Foundation</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Build Smarter with <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">FoundrAI Assistant</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl">
          The ultimate productivity engine for founders. Connect Gmail, Google Calendar, and GitHub using sandboxed MCP servers to coordinate startup actions instantly.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all hover:translate-y-[-1px]"
          >
            Launch Console <ArrowRight size={16} />
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold hover:bg-muted transition-colors"
          >
            Try Chat Playground
          </Link>
        </div>

        {/* HERO MOCKUP PLACEHOLDER */}
        <div className="mt-16 w-full rounded-2xl border border-border bg-card/50 backdrop-blur-md p-2 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none rounded-2xl" />
          <div className="h-64 sm:h-96 w-full rounded-xl bg-muted/40 border border-border/60 flex flex-col items-center justify-center p-6 text-muted-foreground select-none">
            <Cpu size={48} className="text-primary/40 animate-bounce mb-4" />
            <span className="text-sm font-semibold text-foreground">Interactive Admin Console Loaded</span>
            <span className="text-xs text-muted-foreground mt-1 max-w-xs">Explore dashboard controls, AI prompts, and integration settings toggles.</span>
          </div>
        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section className="border-t border-border/60 bg-muted/20 py-20 lg:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
              Engineered for Enterprise Scalability
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
              A solid structural core designed using clean architecture layout conventions and modular layers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] group"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 text-center px-6 max-w-4xl mx-auto border-t border-border/40">
        <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
          Coordinate actions across your workflows today.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground">
          No credit card required. Launch the foundation control panel to explore your workspaces.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all hover:translate-y-[-1px]"
          >
            Get Started Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="border-t border-border bg-card px-6 py-12 text-center text-xs text-muted-foreground">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
          <span>&copy; {new Date().getFullYear()} FoundrAI. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Console</Link>
            <Link href="/chat" className="hover:text-foreground transition-colors">Chat</Link>
            <Link href="/settings" className="hover:text-foreground transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
