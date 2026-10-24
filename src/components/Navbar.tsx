"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCivic } from "@/context/CivicContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import {
  ShieldAlert,
  PlusCircle,
  MapPin,
  KanbanSquare,
  Home,
  RotateCcw,
  Menu,
  X,
  Sparkles,
  Compass,
  User,
  LogOut,
  Building2,
  UserCheck,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { resetToMockData, reports } = useCivic();
  const { user, isAuthenticated, isAdmin, logout, switchDemoAccount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = reports.filter((r) => r.status === "pending").length;

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Street View Feed", icon: Compass },
    {
      href: "/admin",
      label: "Municipal Portal",
      icon: KanbanSquare,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-200 bg-white/80 dark:bg-slate-950/80 border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShieldAlert className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-100 dark:to-indigo-200">
                  CivicFix
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  CivicTech AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Citizen ↔ Municipality Sync
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-slate-100 dark:bg-slate-800/90 text-indigo-600 dark:text-indigo-300 font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Session & Role Indicator */}
            {isAuthenticated && user ? (
              <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isAdmin ? "bg-amber-400" : "bg-indigo-400"
                    }`}
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                      isAdmin
                        ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                        : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    }`}
                  >
                    {isAdmin ? "Admin" : "Citizen"}
                  </span>
                </div>

                {/* Quick Toggle between Citizen & Admin Demo */}
                <button
                  type="button"
                  onClick={() => switchDemoAccount(isAdmin ? "citizen" : "admin")}
                  title={`Switch to ${isAdmin ? "Citizen" : "Municipal Admin"} Demo`}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={logout}
                  title="Sign Out"
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Dark / Light Mode Toggle */}
            <ThemeToggle />

            {/* Primary Action Button: Report Issue */}
            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 shadow-sm hover:shadow-glow transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Report Issue</span>
              <span className="xs:hidden">Report</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {link.badge} pending
                  </span>
                )}
              </Link>
            );
          })}

          {/* Mobile Auth Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {user.fullName}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {user.role} • {user.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 text-xs text-rose-500 font-semibold border border-rose-500/30 rounded-lg hover:bg-rose-500/10"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
              >
                Sign In to CivicFix
              </Link>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Demo controls:</span>
            <button
              onClick={() => {
                resetToMockData();
                setMobileMenuOpen(false);
              }}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Records
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
