import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
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
      setErrorMessage('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await login({
        email: loginIdentifier.trim(),
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
    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
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
        phone: regPhone.trim(),
        email: regEmail.trim(),
        password: regPassword,
        id: useCustomId && regCustomId ? Number(regCustomId) : null,
      });

      setSuccessMessage(`Account #${newAcc.id} created successfully! Logging you in...`);
      if (onAccountCreated) {
        onAccountCreated();
      }

      // Automatically sign in with newly created credentials
      try {
        await login({
          email: regEmail.trim(),
          password: regPassword,
        });
      } catch {
        // Switch to login tab if auto-login fails
        setLoginIdentifier(regEmail.trim());
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
    setRegPhone(`+1555000${rand}`);
    setRegEmail(`alex_${rand}@example.com`);
    setRegPassword('SecretPass123!');
  };

  // 1. Authenticated User Profile View
  if (isAuthenticated && user) {
    const jwtPayload = decodeJwtPayload(token);
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        {/* Profile Card */}
        <div className="bg-white border border-sand-300 rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-sand-300">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-olive via-sand to-terracotta flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-olive/20">
                {user.firstname?.[0]}
                {user.lastname?.[0]}
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-serif font-bold text-midnight-900">
                    {user.firstname} {user.lastname}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-olive-100 text-olive-800 border border-olive-300 text-xs font-medium">
                    Active Session
                  </span>
                </div>
                <p className="text-sm text-terracotta font-mono mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => refreshUser()}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-bone-100 hover:bg-bone-200 text-midnight-900 text-xs font-medium transition border border-sand-300"
                title="Verify live profile with GET /me"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Verify /me</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-terracotta-50 hover:bg-terracotta-100 text-terracotta border border-terracotta-200 text-xs font-medium transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-bone-50 p-4 rounded-2xl border border-sand-300">
              <div className="flex items-center space-x-2 text-brown-600 text-xs mb-1">
                <Hash className="w-3.5 h-3.5 text-terracotta" />
                <span>Account ID</span>
              </div>
              <div className="text-base font-mono font-bold text-midnight-900">#{user.id}</div>
            </div>

            <div className="bg-bone-50 p-4 rounded-2xl border border-sand-300">
              <div className="flex items-center space-x-2 text-brown-600 text-xs mb-1">
                <Mail className="w-3.5 h-3.5 text-terracotta" />
                <span>Email Address</span>
              </div>
              <div className="text-xs font-semibold text-midnight-900 truncate" title={user.email}>
                {user.email}
              </div>
            </div>

            <div className="bg-bone-50 p-4 rounded-2xl border border-sand-300">
              <div className="flex items-center space-x-2 text-brown-600 text-xs mb-1">
                <Phone className="w-3.5 h-3.5 text-terracotta" />
                <span>Phone Number</span>
              </div>
              <div className="text-xs font-mono font-semibold text-midnight-900">{user.phone}</div>
            </div>

            <div className="bg-bone-50 p-4 rounded-2xl border border-sand-300">
              <div className="flex items-center space-x-2 text-brown-600 text-xs mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-olive" />
                <span>Created At</span>
              </div>
              <div className="text-xs text-brown-700">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>

          {/* JWT Token Card */}
          <div className="mt-6 bg-bone-100 border border-sand-300 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-terracotta" />
                <span className="text-xs font-semibold text-midnight-900">
                  JWT Bearer Access Token
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-olive-100 text-olive-800 border border-olive-200 font-mono">
                  Bearer
                </span>
              </div>
              <button
                onClick={() => token && copyToClipboard(token)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-bone-50 text-brown-700 border border-sand-300 text-xs transition"
              >
                {copiedToken ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-olive" />
                    <span className="text-olive">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Token</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-white p-3 rounded-xl border border-sand-300 text-[11px] font-mono text-brown-700 break-all select-all">
              {token}
            </div>

            {jwtPayload && (
              <div className="text-[11px] text-brown-700 bg-white p-3 rounded-xl border border-sand-300">
                <span className="text-brown-600 font-semibold block mb-1">
                  Decoded Token Payload Claims:
                </span>
                <pre className="text-olive font-mono text-[10px] overflow-x-auto">
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
    <div className="max-w-md mx-auto animate-fadeIn">
      <div className="bg-white border border-sand-300 rounded-3xl p-6 sm:p-8 shadow-lg relative">
        {/* Switcher Tab */}
        <div className="flex rounded-xl bg-bone-100 p-1 mb-6 border border-sand-300">
          <button
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'login'
                ? 'bg-olive text-white shadow-md'
                : 'text-brown-700 hover:text-midnight-900 hover:bg-white/70'
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
                ? 'bg-olive text-white shadow-md'
                : 'text-brown-700 hover:text-midnight-900 hover:bg-white/70'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status alerts */}
        {errorMessage && (
          <div className="mb-5 flex items-start space-x-2.5 p-3 rounded-xl bg-terracotta-50 border border-terracotta-200 text-terracotta-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-terracotta mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 flex items-start space-x-2.5 p-3 rounded-xl bg-olive-50 border border-olive-200 text-olive-800 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-olive mt-0.5" />
            <div className="flex-1">{successMessage}</div>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-brown-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-olive" />
                <input
                  type="email"
                  required
                  placeholder="john.doe@example.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10 transition"
                />
              </div>
              <p className="text-[11px] text-brown-600 mt-1">
                Sign in with the email address used during registration.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-brown-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-olive" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-500 hover:text-midnight-900"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-terracotta hover:bg-terracotta-600 disabled:opacity-50 text-white font-medium rounded-xl text-xs transition shadow-lg shadow-terracotta/20 flex items-center justify-center space-x-2"
            >
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Authenticating...' : 'Sign In to Artlife'}</span>
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] text-brown-600 font-medium">New User Details</span>
              <button
                type="button"
                onClick={autofillDemoAccount}
                className="text-[11px] text-terracotta hover:text-terracotta-700 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Autofill Demo Data
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-brown-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-brown-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-brown-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-olive" />
                  <input
                    type="text"
                    required
                    placeholder="+1234567890"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-brown-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-olive" />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-brown-700 mb-1">
                Password <span className="text-brown-500 font-normal">(min 8 chars)</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-olive" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="SecretPassword123!"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 placeholder-brown-400 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-500 hover:text-midnight-900"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Custom ID toggle */}
            <div className="pt-1">
              <label className="flex items-center space-x-2 text-[11px] text-brown-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomId}
                  onChange={(e) => setUseCustomId(e.target.checked)}
                  className="rounded border-sand-400 bg-white text-terracotta focus:ring-terracotta/20"
                />
                <span>Specify Custom ID (otherwise auto-incremented by PostgreSQL)</span>
              </label>
              {useCustomId && (
                <input
                  type="number"
                  placeholder="Custom ID integer (e.g. 5001)"
                  value={regCustomId}
                  onChange={(e) => setRegCustomId(e.target.value)}
                  className="mt-2 w-full px-3 py-1.5 bg-bone-50 border border-sand-300 rounded-xl text-xs text-midnight-900 font-mono placeholder-brown-400 focus:outline-none focus:border-olive"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 bg-terracotta hover:bg-terracotta-600 disabled:opacity-50 text-white font-medium rounded-xl text-xs transition shadow-lg shadow-terracotta/20 flex items-center justify-center space-x-2"
            >
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Creating Account...' : 'Register Account & Sign In'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
