import React, { useState, useMemo } from 'react';
import { ActivityLog, BloodGroup, BLOOD_GROUPS } from '../../types';
import {
  History,
  Search,
  Filter,
  PlusCircle,
  MinusCircle,
  Truck,
  Siren,
  AlertCircle,
  Clock,
  User,
  Layers
} from 'lucide-react';

interface Props {
  activityLogs: ActivityLog[];
}

export const ActivityLogView: React.FC<Props> = ({ activityLogs }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'add' | 'remove' | 'dispatch' | 'sos' | 'threshold'>('ALL');
  const [groupFilter, setGroupFilter] = useState<BloodGroup | 'ALL'>('ALL');

  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      if (typeFilter !== 'ALL' && log.type !== typeFilter) return false;
      if (groupFilter !== 'ALL' && log.bloodGroup !== groupFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          log.action.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          log.user.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activityLogs, typeFilter, groupFilter, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-red-600" />
            <span>Immutable Activity & Regulatory Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically verifiable transaction ledger recording all cold storage entries, write-offs, and emergency dispatches.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-mono font-bold text-slate-700">
          {filteredLogs.length} Logged Transactions
        </span>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, personnel, details..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />
        </div>

        {/* Action Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          >
            <option value="ALL">All Transaction Categories</option>
            <option value="add">Units Added (+ Intake)</option>
            <option value="remove">Units Removed / Write-Offs</option>
            <option value="dispatch">Hospital Dispatches</option>
            <option value="sos">Emergency SOS Alerts</option>
            <option value="threshold">Threshold Triggers</option>
          </select>
        </div>

        {/* Blood Group Filter */}
        <div>
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          >
            <option value="ALL">All Blood Groups</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                Blood Group {bg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No audit records found matching the filter criteria.
          </div>
        ) : (
          filteredLogs.map((log) => {
            let Icon = PlusCircle;
            let iconColor = 'text-emerald-600 bg-emerald-50';
            let badgeText = 'INTAKE';
            let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';

            if (log.type === 'remove') {
              Icon = MinusCircle;
              iconColor = 'text-red-600 bg-red-50';
              badgeText = 'WRITE-OFF';
              badgeStyle = 'bg-red-50 text-red-700 border-red-200';
            } else if (log.type === 'dispatch') {
              Icon = Truck;
              iconColor = 'text-blue-600 bg-blue-50';
              badgeText = 'DISPATCH';
              badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
            } else if (log.type === 'sos') {
              Icon = Siren;
              iconColor = 'text-red-600 bg-red-100';
              badgeText = 'SOS EMERGENCY';
              badgeStyle = 'bg-red-600 text-white font-bold animate-pulse';
            } else if (log.type === 'threshold') {
              Icon = AlertCircle;
              iconColor = 'text-amber-600 bg-amber-50';
              badgeText = 'THRESHOLD WARNING';
              badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
            }

            return (
              <div key={log.id} className="p-4 hover:bg-slate-50/70 transition flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {log.action}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-mono font-bold border ${badgeStyle}`}>
                        {badgeText}
                      </span>
                    </div>

                    <span className="font-mono text-slate-400 text-xs flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {log.timestamp}
                    </span>
                  </div>

                  <p className="text-slate-600 mt-1 leading-relaxed">
                    {log.details}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Personnel: <strong className="text-slate-700">{log.user}</strong></span>
                    </div>

                    {log.bloodGroup && (
                      <span className="font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {log.bloodGroup}
                      </span>
                    )}

                    {log.quantity !== undefined && (
                      <span className={`font-bold font-mono ${log.quantity > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {log.quantity > 0 ? `+${log.quantity}` : log.quantity} Unit(s)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
