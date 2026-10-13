import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Shield,
  Terminal,
  ExternalLink,
  LogOut,
  UserCheck,
  Server,
  RefreshCw,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'directory' | 'auth' | 'explorer';
  setActiveTab: (tab: 'directory' | 'auth' | 'explorer') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated, logout, health, healthLatency, checkHealth, baseUrl, setBaseUrl } =
    useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  Artlife
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20">
                  v1.0 API
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">User & Authentication Platform</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'directory'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Accounts</span>
            </button>

            <button
              onClick={() => setActiveTab('auth')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'auth'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{isAuthenticated ? 'My Profile' : 'Auth & Login'}</span>
            </button>

            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'explorer'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>API Explorer</span>
            </button>
          </nav>

          {/* Health & User actions */}
          <div className="flex items-center space-x-3">
            {/* Backend health status badge */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-1 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  health?.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="text-slate-300 font-medium">
                {health?.status === 'healthy' ? (
                  <>
                    API Live <span className="text-slate-500">({health.database})</span>
                  </>
                ) : (
                  'Checking...'
                )}
              </span>
              {healthLatency !== null && (
                <span className="text-slate-400 text-[10px] font-mono border-l border-slate-700 pl-2">
                  {healthLatency}ms
                </span>
              )}
              <button
                onClick={() => checkHealth()}
                title="Ping backend"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Direct / Proxy Selector */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-800/40 px-2 py-1 rounded-md border border-slate-800">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
              >
                <option value="https://gogo.mababa.app" className="bg-slate-900 text-slate-200">
                  Direct: gogo.mababa.app
                </option>
                <option value="/api" className="bg-slate-900 text-slate-200">
                  Vite Proxy (/api)
                </option>
              </select>
            </div>

            {/* External docs link */}
            <a
              href="https://gogo.mababa.app/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors hidden sm:flex items-center gap-1 text-xs"
              title="Open Backend Swagger Docs"
            >
              <span>Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* User Account / Logout */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div
                  onClick={() => setActiveTab('auth')}
                  className="cursor-pointer flex items-center space-x-2 hover:opacity-80 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-inner">
                    {user.firstname?.[0] || 'U'}
                    {user.lastname?.[0] || ''}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-medium text-slate-200 leading-tight">
                      {user.firstname} {user.lastname}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">@{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition shadow-md shadow-indigo-600/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
