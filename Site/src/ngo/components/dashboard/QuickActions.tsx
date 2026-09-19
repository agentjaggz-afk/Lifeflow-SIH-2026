import React from 'react';
import { ActiveNavPage } from '../../types';
import {
  PlusCircle,
  QrCode,
  Building2,
  Truck,
  Siren,
  BarChart3,
  Sliders
} from 'lucide-react';

interface Props {
  onOpenScanModal: () => void;
  onOpenManualModal: () => void;
  onOpenSosModal: () => void;
  onNavigate: (page: ActiveNavPage) => void;
}

export const QuickActions: React.FC<Props> = ({
  onOpenScanModal,
  onOpenManualModal,
  onOpenSosModal,
  onNavigate
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Operational Quick Commands
        </h2>
        <span className="text-[11px] text-slate-400">
          Fast-access action center
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* + Add Blood Unit */}
        <button
          onClick={onOpenManualModal}
          className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-red-300 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-xs transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 group-hover:text-red-700 leading-tight">
            Add Blood Unit
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">Manual Entry</span>
        </button>

        {/* 📷 Scan Barcode */}
        <button
          onClick={onOpenScanModal}
          className="bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-sm shadow-red-200 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold text-white leading-tight">
            📷 Scan Barcode
          </span>
          <span className="text-[10px] text-red-100 mt-0.5">Camera / Laser</span>
        </button>

        {/* 🏥 View Hospital Requests */}
        <button
          onClick={() => onNavigate('requests')}
          className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-300 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-xs transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700 leading-tight">
            Hospital Requests
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">Review Orders</span>
        </button>

        {/* 🚚 Shipments */}
        <button
          onClick={() => onNavigate('shipments')}
          className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-xs transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 leading-tight">
            Shipments & Fleet
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">Route Dispatch</span>
        </button>

        {/* 🚨 SOS Emergency */}
        <button
          onClick={onOpenSosModal}
          className="bg-white hover:bg-red-50 border border-red-200 hover:border-red-400 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-xs transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <Siren className="w-5 h-5 text-red-600 animate-pulse" />
          </div>
          <span className="text-xs font-bold text-red-700 leading-tight">
            🚨 SOS Emergency
          </span>
          <span className="text-[10px] text-red-500 mt-0.5">Broadcast Alert</span>
        </button>

        {/* 📊 Analytics */}
        <button
          onClick={() => onNavigate('analytics')}
          className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-xs transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 group-hover:text-slate-700 leading-tight">
            Analytics & KPIs
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">Usage Trends</span>
        </button>
      </div>
    </section>
  );
};
