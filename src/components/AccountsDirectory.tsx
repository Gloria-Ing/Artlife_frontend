import React, { useState, useEffect, useCallback } from 'react';
import type { AccountResponse } from '../types/api';
import { apiService, parseApiError } from '../services/api';
import {
  Search,
  RefreshCw,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Eye,
  Download,
  AlertCircle,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface AccountsDirectoryProps {
  onSelectUserForLogin: (email: string) => void;
  onNavigateToRegister: () => void;
  onAccountsLoaded?: (count: number) => void;
}

export const AccountsDirectory: React.FC<AccountsDirectoryProps> = ({
  onSelectUserForLogin,
  onNavigateToRegister,
  onAccountsLoaded,
}) => {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(50);
  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAccounts(skip, limit);
      setAccounts(data);
      if (onAccountsLoaded) {
        onAccountsLoaded(data.length);
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }, [skip, limit, onAccountsLoaded]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredAccounts = accounts.filter((acc) => {
    const term = searchTerm.toLowerCase();
    return (
      acc.firstname?.toLowerCase().includes(term) ||
      acc.lastname?.toLowerCase().includes(term) ||
      acc.email?.toLowerCase().includes(term) ||
      acc.phone?.toLowerCase().includes(term) ||
      acc.id?.toString().includes(term)
    );
  });

  const exportToJson = () => {
    const blob = new Blob([JSON.stringify(accounts, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artlife-accounts-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Accounts Directory
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-terracotta-400 border border-slate-700 font-mono">
              {filteredAccounts.length} visible / {accounts.length} fetched
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered user records returned from backend <code className="text-slate-300 font-mono">GET /accounts</code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchAccounts}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700/60"
            title="Reload from API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportToJson}
            disabled={accounts.length === 0}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700/60 disabled:opacity-40"
            title="Download accounts as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onNavigateToRegister}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-olive-600 to-terracotta-600 hover:from-olive-500 hover:to-terracotta-500 text-white text-xs font-medium transition shadow-lg shadow-olive-900/40"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New User</span>
          </button>
        </div>
      </div>

      {/* Filter and pagination bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, phone, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-olive-500 transition"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setSkip(0);
              }}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 text-xs focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setSkip(Math.max(0, skip - limit))}
              disabled={skip === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 font-mono px-2">
              Offset {skip}
            </span>
            <button
              onClick={() => setSkip(skip + limit)}
              disabled={accounts.length < limit}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center space-x-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <div className="flex-1">
            <p className="font-medium">Failed to load accounts</p>
            <p className="text-xs text-rose-400/80 mt-0.5">{error}</p>
          </div>
          <button
            onClick={fetchAccounts}
            className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Accounts List / Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-terracotta-400 animate-spin" />
            <p className="text-sm text-slate-400">Loading registered accounts from backend...</p>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No accounts found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm
                ? `No accounts matched your search "${searchTerm}". Try a different keyword.`
                : 'No accounts have been registered on this database yet. You can create the first one!'}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-terracotta-400 hover:underline"
              >
                Clear filter
              </button>
            ) : (
              <button
                onClick={onNavigateToRegister}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-terracotta-600 text-bone-50 text-xs font-medium hover:bg-indigo-500"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register New Account
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAccounts.map((account) => {
                  const initials =
                    (account.firstname?.[0] || '') + (account.lastname?.[0] || '');
                  return (
                    <tr
                      key={account.id}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                          #{account.id}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-olive-600 to-terracotta-600 flex items-center justify-center text-white font-bold text-xs shadow">
                            {initials || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200">
                              {account.firstname} {account.lastname}
                            </div>
                            <div className="text-[11px] text-terracotta-400 font-mono">
                              {account.role || 'user'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span>{account.email}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span className="font-mono">{account.phone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formatDate(account.created_at)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedAccount(account)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Inspect account data"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectUserForLogin(account.email)}
                            className="px-2.5 py-1.5 rounded-lg bg-olive-600/20 hover:bg-olive-600/30 text-olive-300 border border-olive-500/30 text-[11px] font-medium transition"
                            title="Prefill login with this email"
                          >
                            Sign In As
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Account Details Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-olive-600 to-terracotta-600 flex items-center justify-center text-white font-bold text-lg">
                  {selectedAccount.firstname?.[0]}
                  {selectedAccount.lastname?.[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedAccount.firstname} {selectedAccount.lastname}
                  </h3>
                  <p className="text-xs text-terracotta-400 font-mono">{selectedAccount.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                  Account ID
                </span>
                <span className="font-mono text-slate-200 text-sm font-semibold">
                  #{selectedAccount.id}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                  Password Status
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Bcrypt Hashed
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 col-span-2">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Email</span>
                <div className="flex items-center justify-between text-slate-200 mt-0.5">
                  <span>{selectedAccount.email}</span>
                  <button
                    onClick={() => handleCopy(selectedAccount.email, 'email')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedText === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 col-span-2">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Phone</span>
                <div className="flex items-center justify-between text-slate-200 font-mono mt-0.5">
                  <span>{selectedAccount.phone}</span>
                  <button
                    onClick={() => handleCopy(selectedAccount.phone, 'phone')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedText === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Created At</span>
                <span className="text-slate-300 mt-0.5 block">{formatDate(selectedAccount.created_at)}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Updated At</span>
                <span className="text-slate-300 mt-0.5 block">{formatDate(selectedAccount.updated_at)}</span>
              </div>
            </div>

            {/* Raw JSON snippet */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Raw JSON Schema (AccountResponse)
              </span>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-emerald-400 font-mono overflow-x-auto max-h-36">
                {JSON.stringify(selectedAccount, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onSelectUserForLogin(selectedAccount.email);
                  setSelectedAccount(null);
                }}
                className="px-4 py-2 bg-terracotta-600 hover:bg-terracotta-500 text-white rounded-xl text-xs font-medium"
              >
                Sign In with {selectedAccount.email}
              </button>
              <button
                onClick={() => setSelectedAccount(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
