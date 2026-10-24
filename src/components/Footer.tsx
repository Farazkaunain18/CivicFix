"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Github, Heart, Activity, CheckCircle2, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-sm">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                CivicFix
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Open civic infrastructure reporting platform connecting community residents with municipal operations through automated AI triage and transparent tracking.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Municipal Systems: Operational</span>
            </div>
          </div>

          {/* Citizen Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Citizen Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/report" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Report Broken Infrastructure
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Live Community Feed & Map
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Upvote Local Fixes
                </Link>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-600 flex items-center gap-1 cursor-not-allowed">
                  SMS / WhatsApp Bot (Demo)
                </span>
              </li>
            </ul>
          </div>

          {/* Municipal Portal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Municipality Portal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Municipal Dispatch Kanban
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Crew Assignment & SLA
                </Link>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-600">
                  GIS Work Order Export
                </span>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-600">
                  Automated Resolution Audits
                </span>
              </li>
            </ul>
          </div>

          {/* CivicTech Hackathon Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              CivicTech Hackathon
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Built with Next.js 14, Tailwind CSS, Google Street View Embed API, and simulated multimodal computer vision triage for community impact.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Next.js 14 App Router
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Tailwind CSS
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Google Street View 360°
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                AI Triage Flow
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 CivicFix Platform. Empowering cities, one block at a time.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for community impact
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
