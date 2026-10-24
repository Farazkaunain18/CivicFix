'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  Building2,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Info,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { login, switchDemoAccount, user, authMode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'citizen' | 'admin') => {
    setIsLoading(true);
    setError(null);
    try {
      if (role === 'citizen') {
        await login('citizen@civicfix.in', 'Citizen@123');
      } else {
        await login('admin@municipal.gov.in', 'Admin@123');
      }
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/20 mb-2">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome to CivicFix
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Sign in to report infrastructure defects, track municipal progress, and verify repairs.
          </p>
        </div>

        {/* Authentication Infrastructure Status Banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Authentication Engine</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-600 text-white">
              {authMode === 'SUPABASE_CLOUD' ? 'Supabase Auth' : 'Cryptographic Local Engine'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            {authMode === 'SUPABASE_CLOUD'
              ? 'Connected to live Supabase backend with encrypted sessions.'
              : 'Passkeys securely hashed via Web Crypto SHA-256. (Set NEXT_PUBLIC_SUPABASE_URL in .env.local for production cloud auth).'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-md shadow-indigo-500/20"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Fast Login for Hackathon Evaluation */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
              1-Click Verified Role Login (India)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('citizen')}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all text-left group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-400">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Citizen Demo</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  Priya S. (Delhi)
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all text-left group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-400">
                  <Building2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Admin Portal</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  Chief Engineer
                </div>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>Don't have an account? </span>
            <Link
              href="/signup"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
