/**
 * Frontend Chat service helper.
 * Communicates with the backend chat endpoint.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function sendChatMessage(message: string, sessionId?: string): Promise<string> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, session_id: sessionId }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to communicate with the server.";
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.error && errorData.error.message) {
        errorMessage = errorData.error.message;
      }
    } catch {
      // Ignore parsing errors and keep fallback message
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.response;
}
