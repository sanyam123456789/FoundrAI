"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { 
  User, 
  Settings as SettingsIcon, 
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

  // Mock form state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "founder@example.com",
    role: "CEO & Co-founder"
  });

  const [integrations, setIntegrations] = useState({
    gmail: true,
    calendar: false,
    github: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved successfully! (Frontend state update placeholder)");
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
            <a href="#integrations" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all">
              <Link2 size={16} />
              <span>Integrations</span>
            </a>
            <a href="#danger" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 text-destructive hover:text-destructive/95 transition-all">
              <Trash2 size={16} />
              <span>Danger Zone</span>
            </a>
          </nav>
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div className="md:col-span-2 space-y-8">
          
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
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
              >
                <Save size={14} /> Save Changes
              </button>
            </form>
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

          {/* INTEGRATIONS SECTION */}
          <section id="integrations" className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-border/40 pb-4">
              <Link2 size={18} className="text-primary" />
              <h2 className="font-bold text-lg">Connected Integrations</h2>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Manage OAuth and sandbox states for developer endpoints (Phase 3 placeholders).
              </p>
              
              <div className="space-y-3">
                {/* GMAIL */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Gmail Integration</h4>
                      <span className="text-[10px] text-muted-foreground">Read and draft alerts</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={integrations.gmail}
                    onChange={(e) => setIntegrations({ ...integrations, gmail: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </div>

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
