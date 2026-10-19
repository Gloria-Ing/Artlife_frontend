import React, { useState } from 'react';
import { ApiExplorer } from './ApiExplorer';
import { AccountsDirectory } from './AccountsDirectory';
import { useAuth } from '../context/AuthContext';
import { Database, ShieldCheck, Terminal, Users } from 'lucide-react';

interface SystemDashboardProps {
  onLoginAsAccount: (email: string) => void;
  onCreateAccount: () => void;
}

export const SystemDashboard: React.FC<SystemDashboardProps> = ({
  onLoginAsAccount,
  onCreateAccount,
}) => {
  const { user } = useAuth();
  const [view, setView] = useState<'accounts' | 'api'>('accounts');
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive-100 text-olive-800 border border-olive-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-terracotta" />
              {isAdmin ? 'Admin system access' : 'Signed-in system access'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-midnight-900">
              Artlife System
            </h1>
            <p className="text-sm text-brown-700 max-w-2xl leading-relaxed">
              View registered accounts, inspect live API responses, and create or test accounts from one workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-full sm:min-w-80 lg:min-w-96">
            <button
              onClick={() => setView('accounts')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition ${
                view === 'accounts'
                  ? 'bg-olive text-white border-olive shadow-md shadow-olive/20'
                  : 'bg-bone-50 text-brown-700 border-sand-300 hover:bg-bone-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Accounts</span>
            </button>
            <button
              onClick={() => setView('api')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition ${
                view === 'api'
                  ? 'bg-olive text-white border-olive shadow-md shadow-olive/20'
                  : 'bg-bone-50 text-brown-700 border-sand-300 hover:bg-bone-100'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>API Tools</span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-bone-50 rounded-3xl border border-sand-300 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-terracotta mb-4">
          <Database className="w-4 h-4" />
          <span>{view === 'accounts' ? 'Registered Accounts' : 'Live API Console'}</span>
        </div>

        {view === 'accounts' ? (
          <AccountsDirectory
            onSelectUserForLogin={onLoginAsAccount}
            onNavigateToRegister={onCreateAccount}
          />
        ) : (
          <ApiExplorer />
        )}
      </section>
    </div>
  );
};
