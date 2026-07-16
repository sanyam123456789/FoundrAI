import React from "react";
import {
  Mail,
  Calendar,
  GitPullRequest,
  CheckSquare,
  Sparkles,
  Activity,
  ArrowUpRight,
  Clock,
  Circle
} from "lucide-react";

export default function DashboardPage() {
  const cards = [
    {
      id: "emails",
      title: "Unread Emails",
      value: "8",
      sub: "3 high priority alerts",
      icon: Mail,
      color: "text-blue-500 bg-blue-500/10",
      items: [
        { label: "Investor Pitch Feedback", source: "venture@capital.com" },
        { label: "Production API Downtime Notification", source: "aws@amazon.com" },
        { label: "New Signup: Stripe Webhook Triggered", source: "stripe@stripe.com" }
      ]
    },
    {
      id: "meetings",
      title: "Today's Meetings",
      value: "3 Scheduled",
      sub: "Next: Sync at 2:00 PM",
      icon: Calendar,
      color: "text-green-500 bg-green-500/10",
      items: [
        { label: "Founders Align & Strategy Review", source: "10:30 AM (Google Meet)" },
        { label: "Client Demo: FoundrAI Integration", source: "2:00 PM (Zoom)" },
        { label: "Backend Engineering Sync Session", source: "4:30 PM (Slack Huddle)" }
      ]
    },
    {
      id: "prs",
      title: "Open GitHub PRs",
      value: "4 Pending",
      sub: "2 require developer approval",
      icon: GitPullRequest,
      color: "text-purple-500 bg-purple-500/10",
      items: [
        { label: "feat: mcp-client-sse-transport-layer", source: "PR #12 - by san-dev" },
        { label: "fix: global-logging-middleware-timestamp", source: "PR #14 - by alex-eng" },
        { label: "refactor: sqlalchemy-sessionmaker-cleanup", source: "PR #15 - by backend-lead" }
      ]
    },
    {
      id: "tasks",
      title: "Active Tasks",
      value: "12 / 18 Done",
      sub: "6 active tasks remaining",
      icon: CheckSquare,
      color: "text-orange-500 bg-orange-500/10",
      items: [
        { label: "Verify Neon PostgreSQL connection limits", source: "High Priority" },
        { label: "Update env.example variables in docker setups", source: "Medium Priority" },
        { label: "Setup custom responses format schemas", source: "Low Priority" }
      ]
    }
  ];

  const suggestions = [
    {
      title: "Synthesize Email Thread",
      desc: "Venture Capital email thread is active. Draft an automated reply answering questions about security scaling.",
      time: "Recommended Action"
    },
    {
      title: "Auto-approve green build PRs",
      desc: "All integration tests passed on PR #14. Trigger automatic merge routine via GitHub integration.",
      time: "Optimization Recommendation"
    }
  ];

  const activities = [
    { desc: "FastAPI health check executed successfully", time: "2 min ago", type: "success" },
    { desc: "PostgreSQL Connection Pool initialized", time: "10 min ago", type: "info" },
    { desc: "Alembic schema history synced with local engine", time: "25 min ago", type: "info" },
    { desc: "Docker Compose networks built on bridge foundrai-net", time: "1 hour ago", type: "success" }
  ];

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and coordinate integrations workflows from a single screen.
          </p>
        </div>
        <div className="text-xs text-muted-foreground bg-muted border border-border px-3 py-1.5 rounded-lg flex items-center gap-1.5 w-fit">
          <Clock size={12} />
          <span>Last updated: Local Sync Active</span>
        </div>
      </div>

      {/* CORE STAT CARDS GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between h-48 group hover:shadow-md transition-all hover:translate-y-[-2px]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">{card.title}</span>
                  <div className={`p-2 rounded-xl ${card.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold tracking-tight">{card.value}</span>
                  <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                </div>
              </div>
              
              <div className="mt-4 border-t border-border/40 pt-3 flex items-center justify-between text-xs text-muted-foreground select-none">
                <span>View Details</span>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED INFORMATION PANELS */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* TASK DETAILS AND LIST */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold tracking-tight">Active Workspaces Summary</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((card) => (
              <div key={`list-${card.id}`} className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-xs text-foreground uppercase tracking-wider">
                  <card.icon size={14} className="text-primary" />
                  <span>{card.title}</span>
                </div>
                <div className="space-y-2">
                  {card.items.map((item, idx) => (
                    <div key={idx} className="text-xs flex flex-col border-b border-border/20 pb-2 last:border-0 last:pb-0">
                      <span className="font-medium text-foreground truncate">{item.label}</span>
                      <span className="text-muted-foreground truncate mt-0.5">{item.source}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIDE PANELS: SUGGESTIONS & ACTIVITY */}
        <div className="space-y-6">
          {/* AI SUGGESTIONS */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full filter blur-xl" />
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Sparkles size={16} />
              <span>AI Task Suggestions</span>
            </div>
            <div className="space-y-3">
              {suggestions.map((s, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-muted/40 p-3 text-xs space-y-1">
                  <div className="flex justify-between items-center font-semibold">
                    <span>{s.title}</span>
                    <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{s.time}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Activity size={16} />
              <span>Recent System Activity</span>
            </div>
            <div className="relative border-l border-border pl-4 ml-2 space-y-4">
              {activities.map((a, idx) => (
                <div key={idx} className="relative text-xs">
                  <span className="absolute -left-[21px] top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-background border border-border">
                    <Circle size={8} className="fill-primary stroke-none" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">{a.desc}</span>
                    <span className="text-[9px] text-muted-foreground/50 mt-0.5">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
