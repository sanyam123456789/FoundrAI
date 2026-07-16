import React from 'react';

interface StatusCardProps {
  provider: string;
  description: string;
  connected: boolean;
  onConnect: () => void;
}

export function StatusCard({ provider, description, connected, onConnect }: StatusCardProps) {
  return (
    <div className="border border-gray-800 bg-gray-950 rounded-lg p-6 flex flex-col justify-between h-48">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg capitalize">{provider}</h3>
          <span
            className={`rounded-full text-xs px-2.5 py-0.5 ${
              connected ? 'bg-green-950 text-green-400' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={onConnect}
        className={`w-full py-2.5 rounded text-sm font-semibold transition-colors ${
          connected ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
        }`}
      >
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}
