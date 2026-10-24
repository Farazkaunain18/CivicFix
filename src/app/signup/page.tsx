'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole, ADMIN_INVITE_CODE } from '@/lib/auth';
import { INDIAN_STATES_AND_UTS } from '@/lib/indiaGeo';
import {
  ShieldAlert,
  Lock,
  Mail,
  User,
  Building2,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('citizen');
  const [adminInviteCode, setAdminInviteCode] = useState('');
  const [state, setState] = useState('Delhi (NCT)');
  const [district, setDistrict] = useState('New Delhi');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentStateObj = INDIAN_STATES_AND_UTS.find((s) => s.name === state);
  const districtList = currentStateObj?.districts || [];

  const handleStateChange = (newState: string) => {
    setState(newState);
    const found = INDIAN_STATES_AND_UTS.find((s) => s.name === newState);
    if (found && found.districts.length > 0) {
      setDistrict(found.districts[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (role === 'admin' && adminInviteCode.trim() !== ADMIN_INVITE_CODE) {
      setError(`Invalid Municipal Admin Authorization Code. (For demo verification, use '${ADMIN_INVITE_CODE}').`);
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        fullName,
        email,
        password,
        role,
        adminInviteCode: role === 'admin' ? adminInviteCode : undefined,
        state,
        district,
      });

      router.push(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/20 mb-2">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create CivicFix Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Join the verified civic infrastructure network for Indian cities and wards.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Signup Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Account Role *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                    role === 'citizen'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Resident Citizen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                    role === 'admin'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Municipal Admin</span>
                </button>
              </div>
            </div>

            {/* Admin Invite Key Input (if admin selected) */}
            {role === 'admin' && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Municipal Authorization Key Required</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  To prevent unauthorized privilege escalation, Municipal Admin accounts require a government authorization token. (Demo code: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300 font-mono">{ADMIN_INVITE_CODE}</code>)
                </p>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={adminInviteCode}
                    onChange={(e) => setAdminInviteCode(e.target.value)}
                    placeholder="Enter authorization key"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-amber-500/30 bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <KeyRound className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address *
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

            {/* State and District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  State / UT *
                </label>
                <select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {INDIAN_STATES_AND_UTS.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  District *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {districtList.map((d, idx) => (
                    <option key={idx} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password (min 6 characters) *
              </label>
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-md shadow-indigo-500/20"
            >
              <span>{isLoading ? 'Creating Account...' : 'Complete Sign Up'}</span>
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
