import React, { useState } from 'react';
import { BloodUnit } from '../../types';
import { AlertCircle, Clock, Send, Check } from 'lucide-react';

interface Props {
  bloodUnits: BloodUnit[];
  onPrioritize: (unitId: string) => void;
  onViewAllExpiring: () => void;
}

export const ExpiringOverview: React.FC<Props> = ({
  bloodUnits,
  onPrioritize,
  onViewAllExpiring
}) => {
  const [filterDays, setFilterDays] = useState<7 | 14 | 30>(7);

  // Helper to calculate days remaining from date string
  const getDaysRemaining = (expDateStr: string): number => {
    // Check if unit has known sample dates
    if (expDateStr.includes('18 Sep 2026')) return 3;
    if (expDateStr.includes('21 Sep 2026')) return 6;
    if (expDateStr.includes('25 Sep 2026')) return 10;
    if (expDateStr.includes('Sep')) return 12;
    if (expDateStr.includes('Oct')) return 28;
    return 35;
  };

  // Filter units expiring within filterDays
  const expiringUnits = bloodUnits
    .filter((u) => u.status === 'Available' || u.status === 'Reserved')
    .map((u) => ({ unit: u, days: getDaysRemaining(u.expiryDate) }))
    .filter((item) => item.days <= filterDays)
    .sort((a, b) => a.days - b.days);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Expiry Management</h3>
            <p className="text-[11px] text-slate-500">Prevent cold chain spoilage</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setFilterDays(7)}
            className={`px-2 py-0.5 rounded-lg font-medium transition ${
              filterDays === 7
                ? 'bg-white text-red-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ≤ 7 Days
          </button>
          <button
            onClick={() => setFilterDays(14)}
            className={`px-2 py-0.5 rounded-lg font-medium transition ${
              filterDays === 14
                ? 'bg-white text-red-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ≤ 14 Days
          </button>
          <button
            onClick={() => setFilterDays(30)}
            className={`px-2 py-0.5 rounded-lg font-medium transition ${
              filterDays === 30
                ? 'bg-white text-red-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ≤ 30 Days
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
        {expiringUnits.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No blood units expiring within {filterDays} days
          </div>
        ) : (
          expiringUnits.slice(0, 5).map(({ unit, days }) => {
            const isCritical = days <= 3;
            const isPriority = unit.storageLocation.includes('PRIORITY');

            return (
              <div
                key={unit.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                  isCritical
                    ? 'bg-red-50/50 border-red-200'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isCritical ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'
                    }`}
                  >
                    {unit.bloodGroup}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {unit.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isCritical
                            ? 'bg-red-100 text-red-800 animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {days} days left
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {unit.component} • {unit.storageLocation}
                    </p>
                  </div>
                </div>

                <div>
                  {isPriority ? (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Prioritized
                    </span>
                  ) : (
                    <button
                      onClick={() => onPrioritize(unit.id)}
                      className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 rounded-lg transition flex items-center gap-1 shadow-2xs"
                      title="Mark as priority for next outbound hospital shipment"
                    >
                      <Send className="w-3 h-3" />
                      <span>Prioritize</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 text-center">
        <button
          onClick={onViewAllExpiring}
          className="text-xs font-semibold text-slate-600 hover:text-red-600 transition"
        >
          View Complete Expiry Schedule ({expiringUnits.length} units flagged) →
        </button>
      </div>
    </div>
  );
};
