"use client";

import { useState } from "react";

export default function Home() {
  const [serverStatus, setServerStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBackendHealth = async () => {
    setIsLoading(true);
    setError(null);
    setServerStatus(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/health`);
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }
      const data = await response.json();
      setServerStatus(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message + " (Make sure backend server is running on port 5000)");
      } else {
        setError("Failed to connect to backend server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between p-6 sm:p-12 font-sans selection:bg-indigo-500 selection:text-white">
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            AJ
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Addy Job</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Client &amp; Server Ready
          </span>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto my-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Column: Overview */}
        <div className="flex flex-col justify-between space-y-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20 mb-4">
              Full-Stack Application Setup
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Next.js + Express
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Aapka full-stack workspace configure ho chuka hai. Frontend <code className="text-indigo-300 font-mono">client/</code> folder me Next.js ke sath hai aur backend <code className="text-cyan-300 font-mono">server/</code> folder me Express + TypeScript ke sath set hai.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Architecture</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-medium text-indigo-400 mb-1">Frontend (client)</div>
                <div className="font-semibold text-slate-100 text-sm">Next.js 15+ App Router</div>
                <div className="text-xs text-slate-400 mt-1">TypeScript, Tailwind CSS</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-medium text-cyan-400 mb-1">Backend (server)</div>
                <div className="font-semibold text-slate-100 text-sm">Node.js + Express</div>
                <div className="text-xs text-slate-400 mt-1">TypeScript, CORS, Dotenv</div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs font-medium text-slate-400 mb-2">Development Commands:</div>
            <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
              <div><span className="text-slate-500"># Start Client (Port 3000):</span> cd client &amp;&amp; npm run dev</div>
              <div><span className="text-slate-500"># Start Server (Port 5000):</span> cd server &amp;&amp; npm run dev</div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Backend Test */}
        <div className="flex flex-col justify-between bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Backend Connection Tester</h2>
            <p className="text-slate-400 text-sm mb-6">
              Test karein ki aapka Next.js client backend Express server se connect ho raha hai ya nahi.
            </p>

            <button
              onClick={checkBackendHealth}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition font-semibold text-sm text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Checking connection...</span>
              ) : (
                <>
                  <span>Ping Server (/api/health)</span>
                  <span>⚡</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex-1 flex flex-col justify-end">
            <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Connection Response
            </div>
            {serverStatus && (
              <pre className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-xs overflow-auto max-h-48">
                {serverStatus}
              </pre>
            )}
            {error && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                ⚠️ {error}
              </div>
            )}
            {!serverStatus && !error && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-slate-500 text-xs text-center">
                Click the button above to test the server health API endpoint.
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-6xl w-full mx-auto border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500">
        addy_job &bull; Full-Stack Project Setup &bull; Client (Next.js) &amp; Server (Express)
      </footer>
    </div>
  );
}
