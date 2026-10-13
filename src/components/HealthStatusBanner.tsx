import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Database, CheckCircle2, AlertTriangle, RefreshCw, Cpu, ExternalLink } from 'lucide-react';

interface HealthBannerProps {
  totalAccounts?: number;
}

export const HealthStatusBanner: React.FC<HealthBannerProps> = ({ totalAccounts }) => {
  const { health, healthLatency, checkHealth, baseUrl } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await checkHealth();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const isHealthy = health?.status === 'healthy';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 mb-8 backdrop-blur-sm relative overflow-hidden shadow-xl shadow-black/20">
      {/* Background ambient glow */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
              isHealthy
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {isHealthy ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-base font-semibold text-white">Backend Connection Status</h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  isHealthy
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isHealthy ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
                  }`}
                />
                {isHealthy ? 'SYSTEM OPERATIONAL' : 'DEGRADED / CONNECTING'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Host: <code className="text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded font-mono">{baseUrl}</code></span>
              <span>•</span>
              <span>Swagger API Docs: <a href="https://gogo.mababa.app/docs" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">https://gogo.mababa.app/docs <ExternalLink className="w-3 h-3" /></a></span>
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center space-x-2 bg-slate-950/60 border border-slate-800/80 px-3.5 py-2 rounded-xl">
            <Database className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Database</div>
              <div className="text-xs font-semibold text-slate-200">
                {health?.database ? `${health.database} (${health.dialect || 'PostgreSQL'})` : 'Connecting...'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/60 border border-slate-800/80 px-3.5 py-2 rounded-xl">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Latency</div>
              <div className="text-xs font-semibold text-slate-200">
                {healthLatency !== null ? `${healthLatency} ms` : '--'}
              </div>
            </div>
          </div>

          {typeof totalAccounts === 'number' && (
            <div className="flex items-center space-x-2 bg-slate-950/60 border border-slate-800/80 px-3.5 py-2 rounded-xl">
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Registered Users</div>
                <div className="text-xs font-semibold text-indigo-300">
                  {totalAccounts} Accounts
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition border border-slate-700/60 disabled:opacity-50"
            title="Refresh health status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Ping Health</span>
          </button>
        </div>
      </div>
    </div>
  );
};
