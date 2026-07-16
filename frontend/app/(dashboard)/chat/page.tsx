"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, User, BrainCircuit, ArrowDown } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I am your FoundrAI Assistant. I can help sync tasks, inspect GitHub PRs, check Gmail alerts, and compile schedule briefings. (Note: External integrations are placeholders in this frontend demo phase).",
      timestamp: "10:30 AM"
    },
    {
      id: "2",
      role: "user",
      content: "Are there any urgent blockers on my GitHub repositories?",
      timestamp: "10:31 AM"
    },
    {
      id: "3",
      role: "assistant",
      content: "Based on the mock repository activity: \n\n* **PR #12** (`feat: mcp-client-sse-transport-layer`) has a green build and is awaiting review.\n* **No critical bugs** or failing production workflows detected. \n\nWould you like me to prepare a pull request review digest?",
      timestamp: "10:31 AM"
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of thread
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay and mock assistant reply
    setTimeout(() => {
      setIsTyping(false);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a static sandbox reply. Real AI replies and workspace integrations will be connected in future backend execution phases. Everything is running correctly!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] border border-border bg-card rounded-2xl overflow-hidden relative shadow-sm">
      
      {/* HEADER SECTION */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-muted/40 px-6">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-semibold">FoundrAI Assistant Playground</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BrainCircuit size={14} className="text-primary" />
          <span>Demo LLM Pipeline</span>
        </div>
      </div>

      {/* MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => {
            const isAss = message.role === "assistant";
            return (
              <div
                key={message.id}
                className={`flex gap-4 ${isAss ? "justify-start" : "justify-end"}`}
              >
                {/* Avatar Icon */}
                {isAss && (
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
                    <Sparkles size={16} />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm max-w-xl leading-relaxed whitespace-pre-line shadow-sm border
                    ${isAss
                      ? "bg-muted/30 border-border/80 text-foreground"
                      : "bg-primary border-primary text-primary-foreground"
                    }
                  `}
                >
                  <p>{message.content}</p>
                  <span
                    className={`block text-[9px] mt-1.5 text-right
                      ${isAss ? "text-muted-foreground" : "text-primary-foreground/75"}
                    `}
                  >
                    {message.timestamp}
                  </span>
                </div>

                {!isAss && (
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-semibold border border-primary/10">
                    JD
                  </div>
                )}
              </div>
            );
          })}

          {/* TYPING LOADER PLACEHOLDER */}
          {isTyping && (
            <div className="flex gap-4 justify-start">
              <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
                <Sparkles size={16} />
              </div>
              <div className="rounded-2xl px-4 py-3.5 bg-muted/30 border border-border/80 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* INPUT FORM CONTAINER */}
      <div className="p-4 border-t border-border bg-muted/20">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Query Gmail alerts, sync schedules, check GitHub status..."
              className="w-full bg-background border border-border rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 disabled:bg-muted/40 disabled:text-muted-foreground transition-all shadow-sm"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
        <p className="text-center text-[10px] text-muted-foreground/60 mt-2">
          This playground functions as a client state sandbox without network API interactions.
        </p>
      </div>

    </div>
  );
}
