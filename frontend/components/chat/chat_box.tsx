import React from 'react';

interface ChatBoxProps {
  sessionId: string;
}

export function ChatBox({ sessionId }: ChatBoxProps) {
  return (
    <div className="border border-gray-800 bg-gray-950 rounded-lg p-6 flex flex-col justify-between h-96">
      <div className="overflow-y-auto space-y-4 text-sm">
        {/* Placeholder conversation logs */}
        <div className="text-gray-500 text-center py-10">No messages in this session yet. Ask a question below.</div>
      </div>
      <div className="flex gap-2 border-t border-gray-800 pt-4">
        <input
          type="text"
          placeholder="Ask a question..."
          className="flex-1 bg-black text-white border border-gray-800 rounded px-3 py-2 text-sm focus:outline-none"
        />
        <button className="bg-purple-600 px-4 py-2 text-xs rounded font-semibold">Send</button>
      </div>
    </div>
  );
}
