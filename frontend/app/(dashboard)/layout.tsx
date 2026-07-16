"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import {
  LayoutDashboard,
  MessageSquare,
  Settings as SettingsIcon,
  Calendar,
  Github,
  Mail,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Bell,
  User,
  X
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  
  // State for sidebar collapse (desktop)
  const [isCollapsed, setIsCollapsed] = useState(false);
  // State for mobile drawer open
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // State for notification drawer display
  const [showNotifications, setShowNotifications] = useState(false);

  // Active link helper
  const isActive = (path: string) => pathname === path;

  // Nav items setup
  const mainNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Chat", href: "/chat", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  const placeholderNavItems = [
    { name: "Calendar", icon: Calendar, tooltip: "Integration Coming Soon" },
    { name: "GitHub", icon: Github, tooltip: "Integration Coming Soon" },
    { name: "Gmail", icon: Mail, tooltip: "Integration Coming Soon" },
  ];

  const mockNotifications = [
    { id: 1, title: "Calendar Sync", desc: "No meetings schedule conflicts found.", time: "10m ago" },
    { id: 2, title: "GitHub PR Alert", desc: "No critical bugs flagged on repositories.", time: "1h ago" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none -z-10" />

      {/* MOBILE SIDEBAR DRAWERS / OVERLAY */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-border bg-card/90 backdrop-blur-md transition-all duration-300
          ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* LOGO AREA */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-indigo-600 text-white font-bold shadow-md">
              F
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                FoundrAI
              </span>
            )}
          </Link>
          
          {/* Collapse sidebar button (desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-6 w-6 items-center justify-center rounded border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Close button (mobile only) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="flex lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          {/* MAIN MENU */}
          <div>
            <span className={`block px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 ${isCollapsed && "lg:text-center lg:px-0"}`}>
              {isCollapsed ? "Menu" : "Core Features"}
            </span>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group relative
                      ${active 
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    <Icon size={18} className={active ? "text-primary-foreground" : "group-hover:text-primary transition-colors"} />
                    {(!isCollapsed || isMobileOpen) && <span>{item.name}</span>}
                    
                    {/* Collapsed Tooltip */}
                    {isCollapsed && (
                      <span className="absolute left-16 scale-0 rounded bg-foreground text-background px-2 py-1 text-xs font-medium group-hover:scale-100 transition-all z-50 whitespace-nowrap shadow-md">
                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* INTEGRATIONS PLACEHOLDERS */}
          <div>
            <span className={`block px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 ${isCollapsed && "lg:text-center lg:px-0"}`}>
              {isCollapsed ? "Hub" : "Future Integrations"}
            </span>
            <div className="space-y-1">
              {placeholderNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/40 cursor-not-allowed group relative"
                  >
                    <Icon size={18} />
                    {(!isCollapsed || isMobileOpen) && (
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-[10px] text-muted-foreground/30 font-normal">Disabled</span>
                      </div>
                    )}

                    {/* Tooltip */}
                    <span className="absolute left-16 scale-0 rounded bg-foreground text-background px-2 py-1 text-xs font-medium group-hover:scale-100 transition-all z-50 whitespace-nowrap shadow-md">
                      {item.tooltip}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM USER PANEL */}
        <div className="p-4 border-t border-border bg-muted/40 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              JD
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold truncate text-foreground">John Doe</span>
                <span className="text-[10px] text-muted-foreground truncate">founder@example.com</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300
          ${isCollapsed ? "lg:pl-20" : "lg:pl-64"}
        `}
      >
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/60 backdrop-blur-md px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu size={20} />
            </button>
            <span className="hidden sm:inline-block font-semibold text-sm text-muted-foreground">
              Workspace Overview
            </span>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Notification bell and overlay */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted relative transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary" />
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card p-4 shadow-xl z-20">
                    <h3 className="font-semibold text-sm mb-3">Notifications</h3>
                    <div className="space-y-3">
                      {mockNotifications.map(n => (
                        <div key={n.id} className="text-xs border-b border-border/50 pb-2 last:border-0 last:pb-0">
                          <div className="flex justify-between font-medium">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-muted-foreground">{n.time}</span>
                          </div>
                          <p className="text-muted-foreground mt-0.5">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* User Profile Avatar Placeholder */}
            <div className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/30 text-primary flex items-center justify-center font-bold text-sm cursor-pointer select-none">
              JD
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
