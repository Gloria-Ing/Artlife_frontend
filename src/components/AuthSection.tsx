import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Key,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Hash,
  Sparkles,
} from 'lucide-react';

interface AuthSectionProps {
  prefilledUsername?: string;
  initialMode?: 'login' | 'register';
  onAccountCreated?: () => void;
}

export const AuthSection: React.FC<AuthSectionProps> = ({
  prefilledUsername,
  initialMode = 'login',
  onAccountCreated,
}) => {
  const { user, token, isAuthenticated, login, register, logout, refreshUser } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState(prefilledUsername || '');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [useCustomId, setUseCustomId] = useState(false);
  const [regCustomId, setRegCustomId] = useState<string>('');

  useEffect(() => {
    if (prefilledUsername) {
      setLoginIdentifier(prefilledUsername);
      setMode('login');
    }
  }, [prefilledUsername]);

  // Decode JWT payload safely
  const decodeJwtPayload = (jwtToken: string | null) => {
    if (!jwtToken) return null;
    try {
      const parts = jwtToken.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(atob(parts[1]));
        return payload;
      }
    } catch {
      return null;
    }
    return null;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter your username/phone and password.');
      return;
    }

    try {
      setLoading(true);
      await login({
        username_or_phone: loginIdentifier.trim(),
        username: loginIdentifier.trim(),
        password: loginPassword,
      });
      setSuccessMessage('Successfully signed in!');
      setLoginPassword('');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Frontend validation hints
    if (regUsername.trim().length < 3) {
      setErrorMessage('Username must be at least 3 characters.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (regPhone.trim().length < 5) {
      setErrorMessage('Phone number must be at least 5 characters.');
      return;
    }

    try {
      setLoading(true);
      const newAcc = await register({
        firstname: regFirstName.trim(),
        lastname: regLastName.trim(),
        username: regUsername.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim(),
        password: regPassword,
        id: useCustomId && regCustomId ? Number(regCustomId) : null,
      });

      setSuccessMessage(`Account #${newAcc.id} (@${newAcc.username}) created successfully! Logging you in...`);
      if (onAccountCreated) {
        onAccountCreated();
      }

      // Automatically sign in with newly created credentials
      try {
        await login({
          username: regUsername.trim(),
          username_or_phone: regUsername.trim(),
          password: regPassword,
        });
      } catch {
        // Switch to login tab if auto-login fails
        setLoginIdentifier(regUsername.trim());
        setMode('login');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const autofillDemoAccount = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    setRegFirstName('Alex');
    setRegLastName('Dev');
    setRegUsername(`alex_${rand}`);
    setRegPhone(`+1555000${rand}`);
    setRegEmail(`alex_${rand}@example.com`);
    setRegPassword('SecretPass123!');
  };

  // 1. Authenticated User Profile View
  if (isAuthenticated && user) {
    const jwtPayload = decodeJwtPayload(token);
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-olive-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-olive-600 via-sand to-terracotta-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-olive-900/30">
                {user.firstname?.[0]}
                {user.lastname?.[0]}
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-white">
                    {user.firstname} {user.lastname}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                    Active Session
                  </span>
                </div>
                <p className="text-sm text-terracotta-400 font-mono mt-0.5">@{user.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => refreshUser()}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700/60"
                title="Verify live profile with GET /me"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Verify /me</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                <Hash className="w-3.5 h-3.5 text-terracotta-400" />
                <span>Account ID</span>
              </div>
              <div className="text-base font-mono font-bold text-white">#{user.id}</div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                <Mail className="w-3.5 h-3.5 text-terracotta-400" />
                <span>Email Address</span>
              </div>
              <div className="text-xs font-semibold text-white truncate" title={user.email}>
                {user.email}
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                <Phone className="w-3.5 h-3.5 text-terracotta-400" />
                <span>Phone Number</span>
              </div>
              <div className="text-xs font-mono font-semibold text-white">{user.phone}</div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Created At</span>
              </div>
              <div className="text-xs text-slate-300">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>

          {/* JWT Token Card */}
          <div className="mt-6 bg-slate-950/90 border border-slate-800/90 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-200">
                  JWT Bearer Access Token
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                  Bearer
                </span>
              </div>
              <button
                onClick={() => token && copyToClipboard(token)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                {copiedToken ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Token</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 break-all select-all">
              {token}
            </div>

            {jwtPayload && (
              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                <span className="text-slate-500 font-semibold block mb-1">
                  Decoded Token Payload Claims:
                </span>
                <pre className="text-emerald-400 font-mono text-[10px] overflow-x-auto">
                  {JSON.stringify(jwtPayload, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated View (Login / Register Tabs)
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
        {/* Switcher Tab */}
        <div className="flex rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800">
          <button
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'login'
                ? 'bg-olive-600 text-bone-50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'register'
                ? 'bg-olive-600 text-bone-50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status alerts */}
        {errorMessage && (
          <div className="mb-5 flex items-start space-x-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 flex items-start space-x-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <div className="flex-1">{successMessage}</div>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username or Phone Number
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. johndoe or +1234567890"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-olive-500 transition"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports either your registered username or phone.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-olive-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-terracotta-600 hover:bg-terracotta-500 disabled:opacity-50 text-white font-medium rounded-xl text-xs transition shadow-lg shadow-terracotta-700/25 flex items-center justify-center space-x-2"
            >
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Authenticating...' : 'Sign In to Artlife'}</span>
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] text-slate-400 font-medium">New User Details</span>
              <button
                type="button"
                onClick={autofillDemoAccount}
                className="text-[11px] text-terracotta-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Autofill Demo Data
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-olive-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-olive-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Username <span className="text-slate-500 font-normal">(min 3 chars)</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="johndoe"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-olive-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="+1234567890"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-olive-500 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-olive-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Password <span className="text-slate-500 font-normal">(min 6 chars)</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="SecretPassword123!"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-olive-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Custom ID toggle */}
            <div className="pt-1">
              <label className="flex items-center space-x-2 text-[11px] text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomId}
                  onChange={(e) => setUseCustomId(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-terracotta-600 focus:ring-0"
                />
                <span>Specify Custom ID (otherwise auto-incremented by PostgreSQL)</span>
              </label>
              {useCustomId && (
                <input
                  type="number"
                  placeholder="Custom ID integer (e.g. 5001)"
                  value={regCustomId}
                  onChange={(e) => setRegCustomId(e.target.value)}
                  className="mt-2 w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-olive-500"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 bg-gradient-to-r from-terracotta-600 to-terracotta-500 hover:from-terracotta-500 hover:to-terracotta-400 disabled:opacity-50 text-white font-medium rounded-xl text-xs transition shadow-lg shadow-terracotta-700/25 flex items-center justify-center space-x-2"
            >
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
