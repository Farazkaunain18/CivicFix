"use client";

import React from "react";
import Link from "next/link";
import { Phone, AlertTriangle, ShieldCheck, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1: About & Purpose */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 text-mint" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Organigen Health
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="flex items-center space-x-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>WHO / MOHFW Triage Protocols Adapted for Punjab</span>
            </div>
          </div>

          {/* Col 2: Punjab Emergency Directory */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Punjab Emergency Helplines
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="tel:108"
                  className="flex items-center space-x-2 text-red-400 hover:text-red-300 font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>108 - Free Ambulance Service</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:102"
                  className="flex items-center space-x-2 text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>102 - Pregnant Women & Infants Transport</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:104"
                  className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>104 - Medical Advice & Grievance Helpline</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:14416"
                  className="flex items-center space-x-2 text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>14416 - Tele-MANAS Mental Health Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/check" className="hover:text-teal-400 transition-colors">
                  {t("nav.check")}
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-teal-400 transition-colors">
                  {t("nav.facilities")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-teal-400 transition-colors">
                  {t("nav.dashboard")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-400 transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Clinical Disclaimer */}
        <div className="pt-6 border-t border-slate-800">
          <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5 border border-slate-700">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-amber-300 font-semibold block sm:inline mr-1">
                Clinical Safety Notice:
              </strong>
              {t("app.disclaimer")}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>© {new Date().getFullYear()} Organigen Health. Built for rural community health in Punjab.</div>
            <div>Offline-Capable Progressive Web App (PWA)</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
