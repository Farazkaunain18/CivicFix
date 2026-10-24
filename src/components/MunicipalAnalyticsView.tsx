'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import { CivicReport } from '../types/civic';
import { computeMunicipalAnalytics } from '../lib/recurringDetection';

interface MunicipalAnalyticsViewProps {
  reports: CivicReport[];
  className?: string;
}

export const MunicipalAnalyticsView: React.FC<MunicipalAnalyticsViewProps> = ({
  reports,
  className = '',
}) => {
  const analytics = computeMunicipalAnalytics(reports);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* MTTR */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Mean Time to Resolution</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100">{analytics.mttrHours}h</div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>-3.2h vs prior municipal quarter</span>
          </p>
        </div>

        {/* SLA Compliance */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">SLA On-Time Compliance</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100">{analytics.slaCompliancePercent}%</div>
          <p className="text-[11px] text-slate-400 mt-1">Target benchmark: ≥ 90%</p>
        </div>

        {/* Recurrence Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Chronic Defect Recurrence</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400">{analytics.recurringDefectRatePercent}%</div>
          <p className="text-[11px] text-slate-400 mt-1">Repeated within 80m & 90 days</p>
        </div>

        {/* Resolution Quality */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Citizen Dispute Rate</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100">{analytics.disputeRatePercent}%</div>
          <p className="text-[11px] text-emerald-400 mt-1">92% verified first-time fixes</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Inflow vs Outflow */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>7-Day Intake vs Resolution Throughput</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily incoming citizen tickets vs completed work orders.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-slate-400">Opened</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-400">Resolved</span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.trendByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="opened" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution & Recurring Hotspots */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Defect Breakdown & Chronic Recurrence</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Total defect volume versus recurring failure frequency.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-slate-400">Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-400">Recurring</span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recurring" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <span>Municipal Department SLA & Resolution Performance</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2.5 font-medium">Department</th>
                <th className="pb-2.5 font-medium">Active Queue</th>
                <th className="pb-2.5 font-medium">Resolved</th>
                <th className="pb-2.5 font-medium">Mean Turnaround (MTTR)</th>
                <th className="pb-2.5 font-medium">SLA Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {analytics.departmentMetrics.map((dept) => (
                <tr key={dept.department} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-medium text-slate-200">{dept.department}</td>
                  <td className="py-3 text-amber-400 font-semibold">{dept.openCount}</td>
                  <td className="py-3 text-emerald-400 font-semibold">{dept.resolvedCount}</td>
                  <td className="py-3 text-slate-300">{dept.mttrHours} hours</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${dept.slaAdherencePercent}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-300">{dept.slaAdherencePercent}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
