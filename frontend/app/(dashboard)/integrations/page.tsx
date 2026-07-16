import React from 'react';

export default function IntegrationsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Integrations Hub</h1>
        <p className="text-sm text-gray-400 mt-1">
          Link Google and GitHub accounts. FoundrAI acts as an ephemeral adapter to run tools on demand.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Google Card */}
        <div className="border border-gray-800 bg-gray-950 rounded-lg p-6 flex flex-col justify-between h-48">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Google Accounts</h3>
              <span className="rounded-full bg-gray-800 text-gray-400 text-xs px-2.5 py-0.5">Disconnected</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Provides access to Gmail endpoints (to search and index priorities) and Google Calendar (to synchronize meeting contexts).
            </p>
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-500 py-2.5 rounded text-sm font-semibold transition-colors">
            Connect Google
          </button>
        </div>

        {/* GitHub Card */}
        <div className="border border-gray-800 bg-gray-950 rounded-lg p-6 flex flex-col justify-between h-48">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">GitHub Developer</h3>
              <span className="rounded-full bg-gray-800 text-gray-400 text-xs px-2.5 py-0.5">Disconnected</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Enables pulling open Pull Requests (reviews blocking you) and Issue trackers to compile code project blockers list.
            </p>
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-500 py-2.5 rounded text-sm font-semibold transition-colors">
            Connect GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
