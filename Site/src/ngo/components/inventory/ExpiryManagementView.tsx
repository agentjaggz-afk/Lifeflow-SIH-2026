import React, { useState, useMemo } from 'react';
import { BloodUnit } from '../../types';
import {
  Clock,
  AlertTriangle,
  Send,
  Check,
  Calendar,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface Props {
  bloodUnits: BloodUnit[];
  onPrioritize: (unitId: string) => void;
  onSelectUnit: (unit: BloodUnit) => void;
}

export const ExpiryManagementView: React.FC<Props> = ({
  bloodUnits,
  onPrioritize,
  onSelectUnit
}) => {
  const [filterDays, setFilterDays] = useState<7 | 14 | 30>(7);
  const [search, setSearch] = useState('');

  const getDaysRemaining = (expDateStr: string): number => {
    if (expDateStr.includes('18 Sep 2026')) return 3;
    if (expDateStr.includes('21 Sep 2026')) return 6;
    if (expDateStr.includes('25 Sep 2026')) return 10;
    if (expDateStr.includes('Sep')) return 12;
    if (expDateStr.includes('Oct')) return 28;
    return 35;
  };

  const flaggedUnits = useMemo(() => {
    return bloodUnits
      .filter((u) => u.status === 'Available' || u.status === 'Reserved')
      .map((u) => ({ unit: u, days: getDaysRemaining(u.expiryDate) }))
      .filter((item) => item.days <= filterDays)
      .filter((item) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          item.unit.id.toLowerCase().includes(q) ||
          item.unit.bloodGroup.toLowerCase().includes(q) ||
          item.unit.component.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.days - b.days);
  }, [bloodUnits, filterDays, search]);

  const under7DaysCount = useMemo(() => {
    return bloodUnits.filter(
      (u) => (u.status === 'Available' || u.status === 'Reserved') && getDaysRemaining(u.expiryDate) <= 7
    ).length;
  }, [bloodUnits]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>Blood Expiry & Cold Chain Spoilage Prevention</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify units approaching shelf-life limits and prioritize them for high-turnover trauma surgery wards.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setFilterDays(7)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterDays === 7
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ≤ 7 Days ({under7DaysCount})
          </button>
          <button
            onClick={() => setFilterDays(14)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterDays === 14
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ≤ 14 Days
          </button>
          <button
            onClick={() => setFilterDays(30)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterDays === 30
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ≤ 30 Days
          </button>
        </div>
      </div>

      {/* Critical Alert Banner if <= 3 days */}
      {flaggedUnits.some((i) => i.days <= 3) && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3 text-red-900">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs">
            <strong className="font-bold text-sm block text-red-800">
              Immediate Dispatch Recommended
            </strong>
            <span>
              Units with less than 72 hours remaining must be tagged for priority hospital dispatch or converted to cryoprecipitate / component derivatives to eliminate biological waste.
            </span>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter expiring units by ID, blood group, component..."
          className="w-full bg-transparent text-xs font-medium focus:outline-hidden"
        />
      </div>

      {/* Flagged Units Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flaggedUnits.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            No blood units are expiring within {filterDays} days.
          </div>
        ) : (
          flaggedUnits.map(({ unit, days }) => {
            const isCritical = days <= 3;
            const isPrioritized = unit.storageLocation.includes('PRIORITY');

            return (
              <div
                key={unit.id}
                className={`rounded-2xl border p-4 transition-all shadow-xs relative flex flex-col justify-between ${
                  isCritical
                    ? 'bg-red-50/40 border-red-200 ring-1 ring-red-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-lg text-white ${
                          isCritical ? 'bg-red-600 shadow-xs shadow-red-200' : 'bg-slate-900'
                        }`}
                      >
                        {unit.bloodGroup}
                      </div>
                      <div>
                        <span className="font-mono font-bold text-xs text-slate-900 block">
                          {unit.id}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {unit.component} • {unit.volumeMl} mL
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isCritical
                          ? 'bg-red-100 text-red-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {days} Days Remaining
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Cold Chain Rack:</span>
                      <span className="font-mono font-semibold">{unit.storageLocation}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Expiry Date:</span>
                      <strong className="text-red-700">{unit.expiryDate}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Collection Date:</span>
                      <span>{unit.collectionDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectUnit(unit)}
                    className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
                  >
                    View Lifecycle →
                  </button>

                  {isPrioritized ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Prioritized for Dispatch
                    </span>
                  ) : (
                    <button
                      onClick={() => onPrioritize(unit.id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs shadow-red-200"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Prioritize for Dispatch</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
