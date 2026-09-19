import React from 'react';
import { BloodInventoryItem, BloodUnit, BloodGroup } from '../../types';
import { BloodStockGrid } from '../dashboard/BloodStockGrid';
import {
  Boxes,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  Activity,
  Calendar,
  Layers,
  ThermometerSnowflake,
  QrCode,
  Sliders
} from 'lucide-react';

interface Props {
  inventory: BloodInventoryItem[];
  bloodUnits: BloodUnit[];
  onOpenScanModal: () => void;
  onOpenManualModal: () => void;
  onFilterGroup: (group: BloodGroup) => void;
  onViewExpiring: () => void;
}

export const InventoryView: React.FC<Props> = ({
  inventory,
  bloodUnits,
  onOpenScanModal,
  onOpenManualModal,
  onFilterGroup,
  onViewExpiring
}) => {
  // Aggregate KPIs
  const totalUnits = inventory.reduce((sum, item) => sum + item.currentUnits, 0);
  const unitsAddedToday = 14;
  const unitsDispatchedToday = 8;
  const unitsReceivedToday = 14;
  const expiringSoonCount = bloodUnits.filter(
    (u) => (u.status === 'Available' || u.status === 'Reserved') && (u.expiryDate.includes('18 Sep') || u.expiryDate.includes('21 Sep') || u.expiryDate.includes('25 Sep'))
  ).length;
  const criticalCount = inventory.filter((i) => i.currentUnits < 100).length;
  const avgDailyUsage = 18.5; // units/day

  // Chart data simulation
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const stockHistory = [320, 335, 310, 345, 338, 350, totalUnits];
  const maxStock = Math.max(...stockHistory) * 1.15;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-red-600" />
            <span>Operational Blood Inventory Control</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time stock monitoring, barcode intake metrics, and cold-chain capacity utilization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenScanModal}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-red-200"
          >
            <QrCode className="w-4 h-4" />
            <span>+ Add Unit (Scan)</span>
          </button>
          <button
            onClick={onOpenManualModal}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4 text-slate-600" />
            <span>Manual Adjustment</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid (7 Key Metrics from Requirement #4) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* 1. Total Blood Units */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Blood Units
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-slate-900">{totalUnits}</span>
            <span className="text-[10px] text-slate-400">units</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +4.2% this wk
          </span>
        </div>

        {/* 2. Units Added Today */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Added Today
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-emerald-600">+{unitsAddedToday}</span>
            <span className="text-[10px] text-slate-400">units</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            From 2 mobile drives
          </span>
        </div>

        {/* 3. Dispatched Today */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Dispatched Today
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-blue-600">-{unitsDispatchedToday}</span>
            <span className="text-[10px] text-slate-400">units</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            3 hospital shipments
          </span>
        </div>

        {/* 4. Received Today */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Received Today
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-slate-900">+{unitsReceivedToday}</span>
            <span className="text-[10px] text-slate-400">tested</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            NAT screening passed
          </span>
        </div>

        {/* 5. Expiring Soon */}
        <div
          onClick={onViewExpiring}
          className="bg-white hover:bg-amber-50/50 p-3.5 rounded-2xl border border-slate-200 hover:border-amber-300 shadow-xs cursor-pointer transition group"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
            Expiring Soon
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-amber-600">{expiringSoonCount}</span>
            <span className="text-[10px] text-slate-400">units</span>
          </div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block group-hover:underline">
            Within 7 days →
          </span>
        </div>

        {/* 6. Critical Blood Groups */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 block">
            Critical Groups (&lt;100)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-red-600">{criticalCount}</span>
            <span className="text-[10px] text-slate-400">shortages</span>
          </div>
          <span className="text-[10px] text-red-700 font-semibold mt-1 block">
            Below 100 units safety
          </span>
        </div>

        {/* 7. Average Daily Usage */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Avg Daily Usage
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-slate-800">{avgDailyUsage}</span>
            <span className="text-[10px] text-slate-400">u/day</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Across 6 hospitals
          </span>
        </div>
      </div>

      {/* Main Stock Grid (8 Groups) */}
      <BloodStockGrid
        inventory={inventory}
        onQuickAdd={(group) => {
          onOpenManualModal();
        }}
        onManualAdjust={(group) => {
          onOpenManualModal();
        }}
        onFilterUnits={(group) => {
          onFilterGroup(group);
        }}
      />

      {/* Graphical Representations (Requirement #4 Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: Inventory Trend Over Time (SVG Area Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Total Blood Stock Level (Last 7 Days)</h3>
              <p className="text-xs text-slate-500">Continuous cold storage unit census</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
              Avg: 334 Units
            </span>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
            {stockHistory.map((val, idx) => {
              const heightPercent = Math.round((val / maxStock) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-mono text-slate-500 font-bold opacity-0 group-hover:opacity-100 transition">
                    {val}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-red-600 to-rose-400 rounded-t-lg transition-all duration-300 group-hover:from-red-700 group-hover:to-rose-500 shadow-xs"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-medium text-slate-400 mt-1">
                    {days[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart B: Blood Group Distribution Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Blood Group Distribution</h3>
              <p className="text-xs text-slate-500">Current stock vs minimum required reserve threshold</p>
            </div>
            <span className="text-xs text-slate-400">8 Groups Tracked</span>
          </div>

          <div className="space-y-2.5">
            {inventory.map((item) => {
              const pct = Math.min(100, Math.round((item.currentUnits / item.maxCapacity) * 100));
              const isRed = item.currentUnits < 100;
              const isYellow = item.currentUnits >= 100 && item.currentUnits <= 150;
              const isGreen = item.currentUnits > 150;

              const statusColor = isRed
                ? 'text-red-600 font-bold'
                : isYellow
                ? 'text-amber-600 font-bold'
                : 'text-emerald-600 font-bold';

              const barColor = isRed
                ? 'bg-red-600'
                : isYellow
                ? 'bg-amber-500'
                : 'bg-emerald-500';

              const statusLabel = isRed
                ? '⚠️ LOW (<100)'
                : isYellow
                ? '⚡ MODERATE (100–150)'
                : '✓ HEALTHY (>150)';

              return (
                <div key={item.bloodGroup} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-7 font-bold font-mono text-slate-900">{item.bloodGroup}</span>
                      <span className={`font-mono text-[11px] ${statusColor}`}>{item.currentUnits} Units</span>
                    </div>
                    <span className={`text-[10px] ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
