/**
 * Shared TypeScript type and interface declarations.
 * Serves as structural templates for future data models (Authentication, AI Chat, and Integrations).
 */

export interface UserSession {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface IntegrationState {
  provider: "gmail" | "calendar" | "github";
  connected: boolean;
  scopes: string[];
}
