import React from 'react';
import { BloodUnit } from '../../types';
import {
  X,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Droplet,
  Layers,
  ThermometerSnowflake,
  AlertCircle
} from 'lucide-react';

interface Props {
  unit: BloodUnit | null;
  onClose: () => void;
}

export const BloodUnitTimelineModal: React.FC<Props> = ({ unit, onClose }) => {
  if (!unit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-extrabold text-xl shadow-xs shadow-red-200">
              {unit.bloodGroup}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold font-mono text-slate-900">
                  {unit.id}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {unit.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {unit.component} • {unit.volumeMl} mL • Donor ID: {unit.donorId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cold-Chain Info Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Cold Storage</span>
            <strong className="text-slate-800 font-medium">{unit.storageLocation}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Collection Date</span>
            <strong className="text-slate-800 font-medium">{unit.collectionDate}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Expiry Date</span>
            <strong className="text-red-700 font-bold">{unit.expiryDate}</strong>
          </div>
        </div>

        {/* Lifecycle Events Timeline */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Chain-of-Custody & Lifecycle History
            </h3>
            <span className="text-[11px] text-slate-400">
              {unit.lifecycle.length} recorded events
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {unit.lifecycle.map((ev, idx) => {
              const isFirst = idx === 0;

              return (
                <div key={idx} className="relative group">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                      isFirst
                        ? 'bg-red-600 shadow-[0_0_8px_#ef4444]'
                        : 'bg-slate-400'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>

                  <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-2xl p-3.5 transition">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        {ev.action}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {ev.timestamp}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Staff: <strong className="text-slate-700">{ev.performedBy}</strong></span>
                      </div>
                      {ev.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ev.location}</span>
                        </div>
                      )}
                    </div>

                    {ev.notes && (
                      <p className="mt-2 text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-100 italic">
                        "{ev.notes}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
          >
            Close Timeline
          </button>
        </div>

      </div>
    </div>
  );
};
