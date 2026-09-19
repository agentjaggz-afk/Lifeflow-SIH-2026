import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  Siren,
  Building2,
  Droplet,
  Send,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  // Monthly trends mock dataset
  const monthlyData = [
    { month: 'Apr', collected: 280, dispatched: 260 },
    { month: 'May', collected: 310, dispatched: 295 },
    { month: 'Jun', collected: 340, dispatched: 330 },
    { month: 'Jul', collected: 365, dispatched: 350 },
    { month: 'Aug', collected: 390, dispatched: 375 },
    { month: 'Sep', collected: 410, dispatched: 388 }
  ];

  const maxVal = 450;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            <span>Operational Logistics Analytics & Intelligence</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key performance indicators, seasonal donor mobilization rates, and regional hospital requisitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
            Reporting Period: FY 2026-Q3
          </span>
        </div>
      </div>

      {/* Analytics KPI Matrix (Section 17 Specifications) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* 1. Total Donations */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Donations
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-slate-900">2,480</span>
            <span className="text-[10px] text-slate-400">donors</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +12% YoY
          </span>
        </div>

        {/* 2. Units Collected */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Units Collected
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-emerald-600">2,095</span>
            <span className="text-[10px] text-slate-400">tested</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">99.2% NAT Pass</span>
        </div>

        {/* 3. Units Dispatched */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Units Dispatched
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-blue-600">1,998</span>
            <span className="text-[10px] text-slate-400">fulfilled</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">To 12 hospitals</span>
        </div>

        {/* 4. Units Expired / Waste Ratio */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Units Expired
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-red-600">14</span>
            <span className="text-[10px] text-slate-400">units</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
            0.6% Low Spoilage
          </span>
        </div>

        {/* 5. Avg Response Time */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Avg Response Time
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-slate-800">18.4</span>
            <span className="text-[10px] text-slate-400">mins</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            From Order to Dispatch
          </span>
        </div>
      </div>

      {/* Demand & Group Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-extrabold text-xl">
            O-
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Most Requested Blood Group
            </span>
            <h4 className="text-sm font-bold text-slate-900">O Negative (Universal RBC)</h4>
            <p className="text-[11px] text-slate-500">Accounts for 38% of trauma emergency orders</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-xl">
            O+
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Most Supplied Blood Group
            </span>
            <h4 className="text-sm font-bold text-slate-900">O Positive (142 Units in stock)</h4>
            <p className="text-[11px] text-slate-500">Highest voluntary donor turnout rate</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Primary Hospital Demand
            </span>
            <h4 className="text-sm font-bold text-slate-900">Apollo & AIIMS Trauma</h4>
            <p className="text-[11px] text-slate-500">62% of regional inter-facility shipments</p>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart: Monthly Collection Trends vs Dispatches */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Monthly Inflow vs Outflow Trends (Apr – Sep 2026)
            </h3>
            <p className="text-xs text-slate-500">
              Comparing voluntary donor units collected vs hospital cold-chain dispatches
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-xs bg-red-600"></span> Units Collected
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-xs bg-slate-800"></span> Units Dispatched
            </span>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="h-60 w-full flex items-end justify-between gap-4 pt-8 pb-3 px-4 border-b border-slate-100">
          {monthlyData.map((m, idx) => {
            const hCol = Math.round((m.collected / maxVal) * 100);
            const hDisp = Math.round((m.dispatched / maxVal) * 100);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center gap-1.5 h-44">
                  {/* Collected */}
                  <div
                    className="w-5 sm:w-8 bg-red-600 rounded-t-md hover:bg-red-700 transition"
                    style={{ height: `${hCol}%` }}
                    title={`Collected: ${m.collected} units`}
                  />
                  {/* Dispatched */}
                  <div
                    className="w-5 sm:w-8 bg-slate-800 rounded-t-md hover:bg-slate-900 transition"
                    style={{ height: `${hDisp}%` }}
                    title={`Dispatched: ${m.dispatched} units`}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
