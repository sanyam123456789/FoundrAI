"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useUser } from "@clerk/nextjs";
import { 
  User, 
  Palette, 
  Link2, 
  Trash2, 
  Mail, 
  Calendar, 
  Github, 
  Save 
} from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();

  // Form state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "Co-founder"
  });

  // Google Integration Status State
  const [googleStatus, setGoogleStatus] = useState<{ connected: boolean; email: string | null }>({
    connected: false,
    email: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync state once Clerk user loads
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        role: "Co-founder"
      });
    }
  }, [user]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Fetch status of Google connection
  const fetchGoogleStatus = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_URL}/api/integrations/google/status?user_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setGoogleStatus(data);
      }
    } catch (e) {
      console.error("Failed to fetch Google integration status:", e);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchGoogleStatus();
    }
  }, [user]);

  // Handle URL query parameters (e.g. callback alerts)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("connected") === "true") {
        setSuccessMsg("Gmail account linked successfully!");
        // Clean params
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (params.get("error")) {
        setErrorMsg(params.get("error"));
        // Clean params
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleConnect = async () => {
    if (!user?.id) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/integrations/google/auth-url?user_id=${user.id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to generate connection URL.");
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to initiate Google connection.");
      setIsProcessing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user?.id) return;
    if (!confirm("Are you sure you want to disconnect Gmail? The assistant will lose access to email operations.")) return;
    
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/integrations/google/disconnect?user_id=${user.id}`, {
        method: "POST"
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to disconnect account.");
      }
      setGoogleStatus({ connected: false, email: null });
      setSuccessMsg("Gmail account disconnected successfully.");
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to disconnect Google connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const [integrations, setIntegrations] = useState({
    gmail: true,
    calendar: false,
    github: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved successfully! (Profile state update placeholder)");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure profile details, manage connected services, and customize theme options.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* LEFT NAV PANEL (STATIC ANCHORS) */}
        <div className="md:col-span-1 space-y-2">
          <nav className="flex flex-col gap-1">
            <a href="#profile" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium bg-muted text-foreground transition-all">
              <User size={16} className="text-primary" />
              <span>Profile Settings</span>
            </a>
            <a href="#appearance" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all">
              <Palette size={16} />
              <span>Appearance</span>
            </a>
            <a href="#google-integrations" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all">
              <Mail size={16} />
              <span>Google Integrations</span>
            </a>
            <a href="#integrations" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all">
              <Link2 size={16} />
              <span>Mock Sandbox</span>
            </a>
            <a href="#danger" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 text-destructive hover:text-destructive/95 transition-all">
              <Trash2 size={16} />
              <span>Danger Zone</span>
            </a>
          </nav>
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div className="md:col-span-2 space-y-8">
          
          {/* ALERTS SECTION */}
          {(successMsg || errorMsg) && (
            <div className="space-y-3">
              {successMsg && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-xs flex justify-between items-center animate-fadeIn">
                  <span>{successMsg}</span>
                  <button onClick={() => setSuccessMsg(null)} className="hover:text-green-400 font-semibold">Dismiss</button>
                </div>
              )}
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex justify-between items-center animate-fadeIn">
                  <span>{errorMsg}</span>
                  <button onClick={() => setErrorMsg(null)} className="hover:text-red-400 font-semibold">Dismiss</button>
                </div>
              )}
            </div>
          )}

          {/* PROFILE SECTION */}
          <section id="profile" className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-border/40 pb-4">
              <User size={18} className="text-primary" />
              <h2 className="font-bold text-lg">Profile Details</h2>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Title / Role</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  disabled
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
              >
                <Save size={14} /> Save Changes
              </button>
            </form>

            {/* CLERK USER METADATA */}
            <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-3 text-xs">
              <h4 className="font-semibold text-foreground">Clerk Account Metadata</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Clerk User ID</span>
                  <span className="font-mono break-all text-foreground">{user?.id || "Loading..."}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Account Created</span>
                  <span className="text-foreground">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "Loading..."}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Last Signed In</span>
                  <span className="text-foreground">
                    {user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "Loading..."}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Identity Provider</span>
                  <span className="capitalize text-foreground">
                    {user?.externalAccounts?.[0]?.provider || "Email/Password"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* APPEARANCE SECTION */}
          <section id="appearance" className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-border/40 pb-4">
              <Palette size={18} className="text-primary" />
              <h2 className="font-bold text-lg">Appearance & Themes</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Theme Mode</h3>
                  <p className="text-xs text-muted-foreground">Switch between light and dark UI presentation formats.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="rounded-lg border border-border bg-background hover:bg-muted px-4 py-2 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                >
                  {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                </button>
              </div>
            </div>
          </section>

          {/* GOOGLE INTEGRATIONS */}
          <section id="google-integrations" className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-border/40 pb-4">
              <Mail size={18} className="text-primary" />
              <h2 className="font-bold text-lg">Google Integrations</h2>
            </div>

            {googleStatus.connected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-green-500/25 bg-green-500/5 p-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-green-500 font-bold text-sm">✅ Gmail Connected</span>
                    <span className="text-xs text-muted-foreground">Linked to: {googleStatus.email}</span>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    disabled={isProcessing}
                    className="rounded-lg bg-destructive hover:bg-destructive/90 px-3.5 py-2 text-xs font-semibold text-destructive-foreground transition-all shadow-sm disabled:opacity-50"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-xs text-muted-foreground">
                  Connect your Gmail account using secure Google OAuth 2.0 authorization.
                  Once linked, FoundrAI will be able to retrieve unread statistics, list recent subject lines, and generate summaries inside your chat playground.
                </p>
                <button
                  onClick={handleConnect}
                  disabled={isProcessing}
                  className="rounded-lg bg-primary hover:bg-primary/95 px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all shadow-sm disabled:opacity-50"
                >
                  {isProcessing ? "Redirecting..." : "Connect Gmail"}
                </button>
              </div>
            )}
          </section>

          {/* MOCK SANDBOX INTEGRATIONS SECTION */}
          <section id="integrations" className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-border/40 pb-4">
              <Link2 size={18} className="text-primary" />
              <h2 className="font-bold text-lg">Connected Integrations (Developer Sandbox)</h2>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Manage sandbox test flags for external pipelines. (UI only placeholders).
              </p>
              
              <div className="space-y-3">
                {/* CALENDAR */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Google Calendar Integration</h4>
                      <span className="text-[10px] text-muted-foreground">Sync meetings coordinates</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={integrations.calendar}
                    onChange={(e) => setIntegrations({ ...integrations, calendar: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

                {/* GITHUB */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                      <Github size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">GitHub Integration</h4>
                      <span className="text-[10px] text-muted-foreground">Inspect Pull Requests logs</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={integrations.github}
                    onChange={(e) => setIntegrations({ ...integrations, github: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* DANGER ZONE SECTION */}
          <section id="danger" className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm space-y-6 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-destructive/10 pb-4">
              <Trash2 size={18} className="text-destructive" />
              <h2 className="font-bold text-lg text-destructive">Danger Zone</h2>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Reset Workspace Data</h3>
                <p className="text-xs text-muted-foreground">
                  Erases connection states and local settings configurations. Action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to reset workspace cache states? (Frontend Mock Action)")) {
                    alert("Mock Reset Complete!");
                  }
                }}
                className="rounded-lg bg-destructive hover:bg-destructive/90 px-4 py-2.5 text-xs font-semibold text-destructive-foreground transition-all shadow-sm"
              >
                Reset Database Cache
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

