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
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AuthSectionProps {
  prefilledUsername?: string;
  initialMode?: 'login' | 'register';
  onAccountCreated?: () => void;
  onAuthenticated?: () => void;
}

export const AuthSection: React.FC<AuthSectionProps> = ({
  prefilledUsername,
  initialMode = 'login',
  onAccountCreated,
  onAuthenticated,
}) => {
  const { isAuthenticated, login, register, logout } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      onAuthenticated?.();
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
        onAuthenticated?.();
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

  const autofillDemoAccount = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    setRegFirstName('Alex');
    setRegLastName('Dev');
    setRegPhone(`+1555000${rand}`);
    setRegEmail(`alex_${rand}@example.com`);
    setRegPassword('SecretPass123!');
  };

  if (isAuthenticated) {
    return (
      <div className="max-w-md mx-auto animate-fadeIn">
        <div className="bg-white border border-sand-300 rounded-3xl p-6 sm:p-8 shadow-lg text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-olive-100 text-olive flex items-center justify-center mx-auto border border-olive-200">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-midnight-900">Account</h2>
            <p className="text-sm text-brown-600 mt-1">You are currently signed in.</p>
          </div>
          <button
            onClick={logout}
            className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-semibold shadow-md shadow-terracotta/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
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
