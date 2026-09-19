import React, { useState } from 'react';
import { AppNotification, NotificationCategory } from '../../types';
import {
  Bell,
  CheckCheck,
  Filter,
  Siren,
  Boxes,
  Building2,
  Truck,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface Props {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onActionClick: (link: string) => void;
}

export const NotificationsView: React.FC<Props> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onActionClick
}) => {
  const [activeCategory, setActiveCategory] = useState<NotificationCategory | 'ALL'>('ALL');

  const filtered = notifications.filter((n) => {
    if (activeCategory !== 'ALL' && n.category !== activeCategory) return false;
    return true;
  });

  const categories: (NotificationCategory | 'ALL')[] = [
    'ALL',
    'Emergency',
    'Inventory',
    'Hospital Requests',
    'Shipments',
    'Expiry',
    'System'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600" />
            <span>Institutional Dispatch & Shortage Alerts</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            System notifications, low-stock threshold triggers, and real-time hospital requisition events.
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeCategory === cat
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No notifications in this category.
          </div>
        ) : (
          filtered.map((n) => {
            let Icon = Bell;
            let iconBg = 'bg-slate-100 text-slate-600';

            if (n.category === 'Emergency') {
              Icon = Siren;
              iconBg = 'bg-red-100 text-red-700 animate-pulse';
            } else if (n.category === 'Hospital Requests') {
              Icon = Building2;
              iconBg = 'bg-amber-100 text-amber-700';
            } else if (n.category === 'Shipments') {
              Icon = Truck;
              iconBg = 'bg-blue-100 text-blue-700';
            } else if (n.category === 'Expiry') {
              Icon = Clock;
              iconBg = 'bg-rose-100 text-rose-700';
            }

            return (
              <div
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`p-4 transition flex items-start justify-between gap-4 cursor-pointer ${
                  !n.read ? 'bg-red-50/40' : 'hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="text-xs flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      )}
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-100">
                        {n.category}
                      </span>
                    </div>

                    <p className="text-slate-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>

                    <div className="mt-2 text-[11px] text-slate-400">
                      {n.timestamp}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {n.actionLink && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onActionClick(n.actionLink!);
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700 text-xs font-semibold rounded-xl transition flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
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
