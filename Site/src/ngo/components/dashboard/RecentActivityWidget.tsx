import React from 'react';
import { ActivityLog } from '../../types';
import { History, PlusCircle, MinusCircle, Truck, Siren, AlertCircle, ArrowRight } from 'lucide-react';

interface Props {
  activities: ActivityLog[];
  onViewAllActivity: () => void;
}

export const RecentActivityWidget: React.FC<Props> = ({
  activities,
  onViewAllActivity
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Real-Time Audit Log</h3>
              <p className="text-[11px] text-slate-500">Immutable ledger of inventory transactions</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        <div className="mt-3 space-y-3 max-h-64 overflow-y-auto divide-y divide-slate-50">
          {activities.slice(0, 5).map((log) => {
            let Icon = PlusCircle;
            let iconColor = 'text-emerald-600 bg-emerald-50';

            if (log.type === 'remove') {
              Icon = MinusCircle;
              iconColor = 'text-red-600 bg-red-50';
            } else if (log.type === 'dispatch') {
              Icon = Truck;
              iconColor = 'text-blue-600 bg-blue-50';
            } else if (log.type === 'sos') {
              Icon = Siren;
              iconColor = 'text-red-700 bg-red-100 animate-pulse';
            } else if (log.type === 'threshold') {
              Icon = AlertCircle;
              iconColor = 'text-amber-600 bg-amber-50';
            }

            return (
              <div key={log.id} className="pt-2.5 first:pt-0 flex items-start gap-2.5 text-left">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${iconColor}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {log.action}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                    {log.details}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    {log.bloodGroup && (
                      <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                        {log.bloodGroup}
                      </span>
                    )}
                    <span>By: <strong className="text-slate-600">{log.user}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 text-center">
        <button
          onClick={onViewAllActivity}
          className="text-xs font-semibold text-slate-600 hover:text-red-600 transition inline-flex items-center gap-1"
        >
          <span>View Full Activity & Audit Trail</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
