"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Globe,
  Sun,
  Moon,
  Type,
  Menu,
  X,
  MapPin,
  ClipboardList,
  Info,
  HeartPulse,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Language } from "@/lib/types";

export default function Navbar() {
  const { language, setLanguage, t, isLargeText, toggleLargeText, isDarkMode, toggleDarkMode } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: HeartPulse },
    { href: "/check", label: t("nav.check"), icon: Activity },
    { href: "/facilities", label: t("nav.facilities"), icon: MapPin },
    { href: "/dashboard", label: t("nav.dashboard"), icon: ClipboardList },
    { href: "/about", label: t("nav.about"), icon: Info },
  ];

  const languages: { code: Language; label: string; native: string }[] = [
    { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "en", label: "English", native: "English" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-primary-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Branding */}
          <Link
            href="/"
            className="flex items-center space-x-3 group rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary flex items-center justify-center text-white shadow-soft group-hover:bg-primary-800 transition-colors shrink-0">
              <Activity className="w-6 h-6 text-mint" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-primary-900 dark:text-teal-400 tracking-tight block leading-tight">
                Organigen <span className="text-primary dark:text-teal-300">Health</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                ਪੰਜਾਬ ਪੇਂਡੂ ਸਿਹਤ ਸਹਾਇਕ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-soft"
                      : "text-slate-700 dark:text-slate-200 hover:bg-mint/50 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Controls: Language, Text Size, Theme */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Switcher */}
            <div className="relative flex items-center bg-white dark:bg-slate-800 border border-teal-200/80 dark:border-slate-700 rounded-xl p-0.5 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-primary ml-2 mr-1 hidden sm:block shrink-0" />
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  aria-label={`Switch language to ${l.label}`}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === l.code
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-teal-300"
                  }`}
                >
                  {l.native}
                </button>
              ))}
            </div>

            {/* Large-Text Accessibility Toggle */}
            <button
              onClick={toggleLargeText}
              title={isLargeText ? "Normal text size" : "Large text size for accessibility"}
              aria-label={isLargeText ? "Normal text size" : "Large text size"}
              className={`p-2 rounded-xl border transition-all ${
                isLargeText
                  ? "bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-200"
                  : "bg-white dark:bg-slate-800 border-teal-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary"
              }`}
            >
              <div className="flex items-center font-bold text-xs">
                <Type className="w-4 h-4" />
                <span className="ml-0.5 text-[10px]">{isLargeText ? "A+" : "A"}</span>
              </div>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary transition-all"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-light dark:bg-surface-dark border-b border-teal-100 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-800 dark:text-slate-100 hover:bg-mint/60 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
