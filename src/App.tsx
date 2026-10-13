import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HealthStatusBanner } from './components/HealthStatusBanner';
import { AccountsDirectory } from './components/AccountsDirectory';
import { AuthSection } from './components/AuthSection';
import { ApiExplorer } from './components/ApiExplorer';
import { Shield, ExternalLink } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'auth' | 'explorer'>('directory');
  const [prefilledUsername, setPrefilledUsername] = useState<string>('');
  const [totalAccounts, setTotalAccounts] = useState<number | undefined>(undefined);

  const handleSelectUserForLogin = (username: string) => {
    setPrefilledUsername(username);
    setActiveTab('auth');
  };

  const handleNavigateToRegister = () => {
    setPrefilledUsername('');
    setActiveTab('auth');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HealthStatusBanner totalAccounts={totalAccounts} />

        {activeTab === 'directory' && (
          <AccountsDirectory
            onSelectUserForLogin={handleSelectUserForLogin}
            onNavigateToRegister={handleNavigateToRegister}
            onAccountsLoaded={(count) => setTotalAccounts(count)}
          />
        )}

        {activeTab === 'auth' && (
          <AuthSection
            prefilledUsername={prefilledUsername}
            onAccountCreated={() => {
              // Could trigger accounts reload
            }}
          />
        )}

        {activeTab === 'explorer' && <ApiExplorer />}
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300 font-medium">Artlife Frontend Interface</span>
            <span>— Connected to PostgreSQL & FastAPI Backend</span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://gogo.mababa.app/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <span>API Swagger Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://gogo.mababa.app/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <span>OpenAPI Specification</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
