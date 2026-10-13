import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import {
  Terminal,
  Play,
  Copy,
  Check,
  Clock,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Code2,
} from 'lucide-react';

interface EndpointConfig {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  requiresAuth: boolean;
  defaultBody?: string;
  defaultParams?: Record<string, unknown>;
}

const ENDPOINTS: EndpointConfig[] = [
  {
    id: 'health',
    name: 'Health & Database Check',
    method: 'GET',
    path: '/health',
    description: 'Checks the health of the application and validates connectivity to PostgreSQL.',
    requiresAuth: false,
  },
  {
    id: 'root',
    name: 'Root Service Info',
    method: 'GET',
    path: '/',
    description: 'Returns welcome information and links to interactive API documentation.',
    requiresAuth: false,
  },
  {
    id: 'accounts',
    name: 'List Accounts',
    method: 'GET',
    path: '/accounts',
    description: 'Retrieve a list of all registered accounts (password hashes omitted). Supports skip and limit.',
    requiresAuth: false,
    defaultParams: { skip: 0, limit: 10 },
  },
  {
    id: 'me',
    name: 'Get Current Profile',
    method: 'GET',
    path: '/me',
    description: "Retrieve the authenticated user's account details using the Bearer JWT token.",
    requiresAuth: true,
  },
  {
    id: 'register',
    name: 'Register Account',
    method: 'POST',
    path: '/register',
    description: 'Create a new user account with firstname, lastname, username, phone, email, and password.',
    requiresAuth: false,
    defaultBody: JSON.stringify(
      {
        firstname: 'Test',
        lastname: 'Explorer',
        username: `tester_${Math.floor(1000 + Math.random() * 9000)}`,
        phone: `+1202555${Math.floor(1000 + Math.random() * 9000)}`,
        email: `tester_${Math.floor(1000 + Math.random() * 9000)}@example.com`,
        password: 'Password123!',
      },
      null,
      2
    ),
  },
  {
    id: 'login',
    name: 'Login User',
    method: 'POST',
    path: '/login',
    description: 'Authenticate a user using their username OR phone number alongside their password.',
    requiresAuth: false,
    defaultBody: JSON.stringify(
      {
        username_or_phone: 'johndoe',
        password: 'SecretPassword123!',
      },
      null,
      2
    ),
  },
];

export const ApiExplorer: React.FC = () => {
  const { token, baseUrl } = useAuth();
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointConfig>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState<string>(selectedEndpoint.defaultBody || '');
  const [queryParams, setQueryParams] = useState<Record<string, unknown>>(
    selectedEndpoint.defaultParams || {}
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  interface ExecutionResult {
    status: number;
    statusText: string;
    headers: unknown;
    data: unknown;
    durationMs: number;
    isError: boolean;
  }

  const [responseResult, setResponseResult] = useState<ExecutionResult | null>(null);

  const handleSelectEndpoint = (ep: EndpointConfig) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultBody || '');
    setQueryParams(ep.defaultParams || {});
    setResponseResult(null);
  };

  const handleExecute = async () => {
    setLoading(true);
    let parsedBody: unknown = undefined;
    if (selectedEndpoint.method === 'POST' && requestBody.trim()) {
      try {
        parsedBody = JSON.parse(requestBody);
      } catch (err) {
        alert('Invalid JSON in request body');
        setLoading(false);
        return;
      }
    }

    try {
      const result = await apiService.rawRequest(
        selectedEndpoint.method,
        selectedEndpoint.path,
        parsedBody,
        selectedEndpoint.method === 'GET' ? queryParams : undefined
      );
      setResponseResult(result);
    } catch (err: unknown) {
      setResponseResult({
        status: 500,
        statusText: 'Failed',
        headers: {},
        data: { error: String(err) },
        durationMs: 0,
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (responseResult?.data) {
      navigator.clipboard.writeText(JSON.stringify(responseResult.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (status >= 400 && status < 500) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          Interactive API Console
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Execute live HTTP requests against <code className="text-slate-300 font-mono">{baseUrl}</code> and inspect response payloads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Selector Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2 mb-2">
            Available Endpoints
          </div>
          {ENDPOINTS.map((ep) => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => handleSelectEndpoint(ep)}
                className={`w-full text-left p-3 rounded-xl transition border flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      ep.method === 'GET'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-medium text-slate-200 truncate">{ep.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">{ep.path}</div>
                  </div>
                </div>

                {ep.requiresAuth && (
                  <span
                    title={token ? 'Authenticated with Bearer token' : 'Requires login token'}
                    className="shrink-0"
                  >
                    {token ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Request / Response Workspace */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Endpoint Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
                    selectedEndpoint.method === 'GET'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-sm font-semibold text-white">
                  {selectedEndpoint.path}
                </span>
              </div>

              <button
                onClick={handleExecute}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition"
              >
                <Play className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">{selectedEndpoint.description}</p>

            {selectedEndpoint.requiresAuth && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                  token
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                }`}
              >
                {token ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Bearer JWT token is active and will be attached automatically.</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>You are not logged in. This request may return a 401 Unauthorized.</span>
                  </>
                )}
              </div>
            )}

            {/* Query parameters for GET /accounts */}
            {selectedEndpoint.id === 'accounts' && (
              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-2">Query Parameters</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">skip</label>
                    <input
                      type="number"
                      value={Number(queryParams.skip ?? 0)}
                      onChange={(e) =>
                        setQueryParams({ ...queryParams, skip: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">limit</label>
                    <input
                      type="number"
                      value={Number(queryParams.limit ?? 10)}
                      onChange={(e) =>
                        setQueryParams({ ...queryParams, limit: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* POST JSON Body Editor */}
            {selectedEndpoint.method === 'POST' && (
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" /> JSON Request Body
                  </span>
                  <button
                    onClick={() => setRequestBody(selectedEndpoint.defaultBody || '{}')}
                    className="text-[11px] text-indigo-400 hover:underline"
                  >
                    Reset Body
                  </button>
                </div>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:border-indigo-500 resize-y"
                  spellCheck={false}
                />
              </div>
            )}
          </div>

          {/* Response Viewer Card */}
          {responseResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono border ${getStatusColor(
                      responseResult.status
                    )}`}
                  >
                    {responseResult.status} {responseResult.statusText}
                  </span>
                  <div className="flex items-center space-x-1 text-slate-400 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{responseResult.durationMs}ms</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyResponse}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Response</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Formatted JSON Output */}
              <div className="relative">
                <div className="absolute right-3 top-3 text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Layers className="w-3 h-3" /> JSON Response
                </div>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-96">
                  {JSON.stringify(responseResult.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
