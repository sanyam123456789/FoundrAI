"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, BrainCircuit } from "lucide-react";
import { sendChatMessage } from "@/services/chat";

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
      content: "Hello! I am your FoundrAI Assistant. I can help sync tasks, inspect GitHub PRs, check Gmail alerts, and compile schedule briefings.",
      timestamp: "10:30 AM"
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of thread
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    setError(null);
    const userMessageContent = inputValue.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const responseText = await sendChatMessage(userMessageContent);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Chat API error:", err);
      let friendlyError = "Something went wrong. Please try again.";
      if (err.message) {
        if (err.message.includes("Failed to fetch")) {
          friendlyError = "The backend server is unreachable. Please verify that the backend is running.";
        } else {
          friendlyError = err.message;
        }
      }
      setError(friendlyError);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isTyping) {
        const mockEvent = {
          preventDefault: () => {}
        } as React.FormEvent;
        handleSend(mockEvent);
      }
    }
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
          <span>Groq LLM Pipeline</span>
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
        {error && (
          <div className="max-w-3xl mx-auto mb-3 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="hover:text-red-400 font-bold ml-2">Dismiss</button>
          </div>
        )}
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="relative flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Query Gmail alerts, sync schedules, check GitHub status..."
              className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner resize-none min-h-[46px] max-h-[160px] overflow-y-auto align-middle"
              disabled={isTyping}
              rows={1}
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className="absolute right-2.5 bottom-2.5 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 disabled:bg-muted/40 disabled:text-muted-foreground transition-all shadow-sm"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
        <p className="text-center text-[10px] text-muted-foreground/60 mt-2">
          This playground is connected directly to Groq's API.
        </p>
      </div>

    </div>
  );
}

