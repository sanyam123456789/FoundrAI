import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 text-center transition-colors duration-200 relative overflow-hidden">
      
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full filter blur-3xl pointer-events-none -z-10" />

      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 shadow-xl flex flex-col items-center gap-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-sm">
          <AlertCircle size={28} />
        </div>
        
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">404</h1>
          <h2 className="text-lg font-bold text-foreground mt-2">Workspace Page Not Found</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            The workspace segment you are looking for does not exist or has been disabled in Phase 3 (Frontend Foundation).
          </p>
        </div>

        <div className="w-full border-t border-border/40 pt-2">
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all"
          >
            <ArrowLeft size={16} /> Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
