import React from 'react';
import { SosAlert, BloodInventoryItem, ConnectedHospital, NgoNetworkPeer, BloodGroup } from '../../types';
import {
  Siren,
  AlertTriangle,
  Building2,
  Globe2,
  Phone,
  Radio,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface Props {
  sosAlert: SosAlert;
  inventory: BloodInventoryItem[];
  hospitals: ConnectedHospital[];
  networkPeers: NgoNetworkPeer[];
  onOpenSosModal: () => void;
  onDeactivateSos: () => void;
  onRequestTransfer: (targetName: string, bloodGroup: BloodGroup, units: number) => void;
}

export const EmergencyControlCenterView: React.FC<Props> = ({
  sosAlert,
  inventory,
  hospitals,
  networkPeers,
  onOpenSosModal,
  onDeactivateSos,
  onRequestTransfer
}) => {
  const currentInv = inventory.find((i) => i.bloodGroup === sosAlert.bloodGroup);
  const available = currentInv?.currentUnits || 0;
  const shortage = Math.max(0, sosAlert.requiredUnits - available);

  // Discover peer NGOs and hospitals that have available stock of the distress blood group
  const matchingPeers = networkPeers
    .map((p) => {
      const match = p.availableGroups.find((g) => g.group === sosAlert.bloodGroup);
      return { peer: p, unitsAvailable: match ? match.units : 0 };
    })
    .filter((item) => item.unitsAvailable > 0)
    .sort((a, b) => b.unitsAvailable - a.unitsAvailable);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Siren className="w-5 h-5 text-red-600" />
            <span>Emergency SOS Coordination Command Center</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Regional distress broadcasting, real-time shortage bridging, and mutual aid inter-facility allocation.
          </p>
        </div>

        <div>
          {sosAlert.isActive ? (
            <button
              onClick={onDeactivateSos}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Stand Down / Deactivate SOS
            </button>
          ) : (
            <button
              onClick={onOpenSosModal}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-red-200"
            >
              <Siren className="w-4 h-4 animate-bounce" />
              <span>🚨 Activate Emergency SOS</span>
            </button>
          )}
        </div>
      </div>

      {/* ACTIVE EMERGENCY DASHBOARD CARD */}
      {sosAlert.isActive ? (
        <div className="bg-gradient-to-br from-red-950 via-red-900 to-rose-950 text-white rounded-3xl p-6 shadow-xl border border-red-800 relative overflow-hidden">
          {/* Pulsing ambient light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 pb-6 border-b border-red-800/80">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white text-red-700 flex items-center justify-center font-extrabold text-3xl shadow-lg">
                {sosAlert.bloodGroup}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-600 text-white animate-pulse">
                    🚨 ACTIVE EMERGENCY
                  </span>
                  <span className="text-xs text-red-200">
                    Broadcasted at {sosAlert.activatedAt || 'Just now'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  {sosAlert.hospitalName}
                </h3>
                <p className="text-xs text-red-100 mt-1 max-w-xl">
                  "{sosAlert.message}"
                </p>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-4 bg-red-900/50 p-4 rounded-2xl border border-red-800 shrink-0">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-red-300 block">Required</span>
                <span className="text-2xl font-black font-mono text-white">{sosAlert.requiredUnits}</span>
                <span className="text-[10px] text-red-200 block">Units</span>
              </div>
              <div className="text-center border-x border-red-800 px-3">
                <span className="text-[10px] uppercase font-bold text-red-300 block">In Local Hub</span>
                <span className="text-2xl font-black font-mono text-emerald-300">{available}</span>
                <span className="text-[10px] text-red-200 block">Available</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-yellow-300 block">Shortage Gap</span>
                <span className="text-2xl font-black font-mono text-yellow-300">{shortage}</span>
                <span className="text-[10px] text-red-200 block">Deficit</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-red-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold">
                <Clock className="w-4 h-4 text-red-300" />
                Required By: <strong className="text-white font-mono">{sosAlert.requiredBy}</strong>
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                Broadcasted to <strong>{sosAlert.notifiedHospitals} Hospitals</strong> & <strong>{sosAlert.notifiedNgos} NGOs</strong>
              </span>
            </div>

            <button
              onClick={onDeactivateSos}
              className="px-4 py-2 bg-white hover:bg-red-50 text-red-800 font-bold rounded-xl text-xs transition shadow-sm"
            >
              Stand Down Alert Protocol
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                System Status: Standard Operational Readiness
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                No active distress emergencies triggered. Regional blood supply channels synchronized.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSosModal}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Trigger SOS Drill / Alert
          </button>
        </div>
      )}

      {/* Recommended Nearby Connected Facilities (Requirement #14 & #18) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Regional Stock Availability & Transfer Discovery
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Peer NGOs and regional blood banks holding confirmed reserves of {sosAlert.bloodGroup}:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchingPeers.map(({ peer, unitsAvailable }) => (
            <div
              key={peer.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{peer.name}</h4>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {peer.distanceKm} km
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{peer.location}</p>

                <div className="mt-3 p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Available {sosAlert.bloodGroup}:
                  </span>
                  <span className={`text-sm font-extrabold font-mono ${
                    unitsAvailable < 100
                      ? 'text-red-600'
                      : unitsAvailable <= 150
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}>
                    {unitsAvailable} Units
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${peer.phone}`}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{peer.phone}</span>
                </a>

                <button
                  onClick={() => onRequestTransfer(peer.name, sosAlert.bloodGroup, Math.min(unitsAvailable, shortage || 4))}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Request Transfer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
