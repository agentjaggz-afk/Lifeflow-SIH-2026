import React from 'react';
import { BloodInventoryItem, BloodGroup } from '../../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, TrendingUp, Plus, Sliders } from 'lucide-react';

interface Props {
  inventory: BloodInventoryItem[];
  onQuickAdd: (group: BloodGroup) => void;
  onManualAdjust: (group: BloodGroup) => void;
  onFilterUnits: (group: BloodGroup) => void;
}

export const BloodStockGrid: React.FC<Props> = ({
  inventory,
  onQuickAdd,
  onManualAdjust,
  onFilterUnits
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Live Blood Group Inventory</span>
            <span className="text-xs font-normal text-slate-500">
              (Real-time Cold Chain Monitoring)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatic threshold detection: <span className="text-red-600 font-semibold">&lt;100 units (Red)</span>,{' '}
            <span className="text-amber-600 font-semibold">100–150 units (Yellow)</span>, and{' '}
            <span className="text-emerald-600 font-semibold">&gt;150 units (Green)</span>.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> &gt; 150 Units (Green)
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 100–150 Units (Yellow)
          </span>
          <span className="flex items-center gap-1.5 text-red-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 -ml-4"></span> &lt; 100 Units (Red)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventory.map((item) => {
          const percent = Math.min(100, Math.round((item.currentUnits / item.maxCapacity) * 100));
          const isCritical = item.currentUnits < 100;
          const isApproaching = item.currentUnits >= 100 && item.currentUnits <= 150;
          const isHealthy = item.currentUnits > 150;

          // Visual theme classes
          let cardBg = 'bg-white border-emerald-200 hover:border-emerald-300 shadow-xs ring-1 ring-emerald-100';
          let statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
          let StatusIcon = ShieldCheck;
          let progressColor = 'bg-emerald-500';
          let unitsColor = 'text-emerald-600';
          let groupBadgeBg = 'bg-emerald-600 text-white shadow-emerald-200';
          let statusLabel = 'Healthy (>150)';

          if (isCritical) {
            cardBg = 'bg-red-50/40 border-red-300 shadow-xs shadow-red-100 ring-1 ring-red-300';
            statusBadge = 'bg-red-100 text-red-800 border-red-300 font-bold animate-pulse';
            StatusIcon = AlertOctagon;
            progressColor = 'bg-red-600';
            unitsColor = 'text-red-600';
            groupBadgeBg = 'bg-red-600 text-white shadow-red-200';
            statusLabel = 'Critical (<100)';
          } else if (isApproaching) {
            cardBg = 'bg-amber-50/30 border-amber-300 shadow-xs shadow-amber-100 ring-1 ring-amber-200';
            statusBadge = 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
            StatusIcon = AlertTriangle;
            progressColor = 'bg-amber-500';
            unitsColor = 'text-amber-500';
            groupBadgeBg = 'bg-amber-500 text-white shadow-amber-200';
            statusLabel = 'Moderate (100–150)';
          }

          return (
            <div
              key={item.bloodGroup}
              className={`rounded-2xl border p-4 transition-all duration-150 relative group ${cardBg}`}
            >
              {/* Top Row: Group Badge & Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-xs ${groupBadgeBg}`}
                  >
                    {item.bloodGroup}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Blood Group
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      Threshold: <strong className="font-mono text-slate-800">{item.minThreshold}</strong>
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${statusBadge}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusLabel}
                </span>
              </div>

              {/* Middle Row: Units Display */}
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`text-3xl font-extrabold tracking-tight font-mono ${unitsColor}`}
                    >
                      {item.currentUnits}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Units</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Updated {item.lastUpdated}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">
                    {percent}%
                  </span>
                  <p className="text-[10px] text-slate-400">of capacity</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Quick Actions On Hover / Tap */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onQuickAdd(item.bloodGroup)}
                  className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 hover:underline text-[11px]"
                  title="Quick add unit"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+1 Unit</span>
                </button>

                <button
                  onClick={() => onManualAdjust(item.bloodGroup)}
                  className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 text-[11px]"
                  title="Manual adjustment with audit reason"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Adjust</span>
                </button>

                <button
                  onClick={() => onFilterUnits(item.bloodGroup)}
                  className="text-slate-500 hover:text-red-600 font-medium text-[11px]"
                  title="View units of this blood group"
                >
                  View units →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
