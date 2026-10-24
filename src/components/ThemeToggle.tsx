"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-slate-700/50 bg-slate-800/40" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle Dark/Light Mode"
      className="relative p-2 rounded-xl transition-all duration-200 border text-slate-400 hover:text-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 light:border-slate-200 light:bg-white light:text-slate-600 light:hover:bg-slate-100 hover:scale-105 active:scale-95 shadow-sm"
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300" />
      )}
    </button>
  );
}
