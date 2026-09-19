import React, { useState, useMemo } from 'react';
import { ConnectedHospital, BloodGroup, BLOOD_GROUPS } from '../../types';
import {
  Building2,
  Search,
  Phone,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  AlertOctagon,
  Inbox,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

interface Props {
  hospitals: ConnectedHospital[];
  onRequestBloodForHospital: (hospital: ConnectedHospital) => void;
  onViewHospitalRequests: (hospitalId: string) => void;
}

export const ConnectedHospitalsView: React.FC<Props> = ({
  hospitals,
  onRequestBloodForHospital,
  onViewHospitalRequests
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Connected' | 'Emergency' | 'Pending' | 'Offline'>('ALL');
  const [bloodFilter, setBloodFilter] = useState<BloodGroup | 'ALL'>('ALL');

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      if (statusFilter !== 'ALL' && h.connectionStatus !== statusFilter) return false;
      if (bloodFilter !== 'ALL' && !h.bloodRequirements.includes(bloodFilter)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          h.name.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          h.contactPerson.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [hospitals, statusFilter, bloodFilter, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-red-600" />
            <span>Affiliated Healthcare Facilities & Hospital Network</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time inter-facility connection statuses, routine requirements, and mutual emergency aid.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
            {hospitals.length} Connected Facilities
          </span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospital by name, location, contact..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          >
            <option value="ALL">All Connection Statuses</option>
            <option value="Connected">Connected & Syncing</option>
            <option value="Emergency">🚨 Active Emergency Mode</option>
            <option value="Pending">Pending Affiliation</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        {/* Blood Filter */}
        <div>
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          >
            <option value="ALL">All Blood Group Demands</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                Demands Blood Group {bg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHospitals.map((hosp) => {
          const isEmergency = hosp.connectionStatus === 'Emergency';
          let statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          if (isEmergency) statusBadge = 'bg-red-100 text-red-800 border-red-300 animate-pulse font-bold';
          if (hosp.connectionStatus === 'Pending') statusBadge = 'bg-amber-50 text-amber-800 border-amber-200';
          if (hosp.connectionStatus === 'Offline') statusBadge = 'bg-slate-100 text-slate-600 border-slate-200';

          return (
            <div
              key={hosp.id}
              className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                isEmergency
                  ? 'bg-red-50/40 border-red-300 ring-1 ring-red-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Top Row */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {hosp.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{hosp.location} • <strong className="text-slate-700">{hosp.distanceKm} km</strong></span>
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] border ${statusBadge}`}>
                    {hosp.connectionStatus}
                  </span>
                </div>

                {/* Requirements Pills */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Active Clinical Blood Requirements
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hosp.bloodRequirements.map((bg) => (
                      <span
                        key={bg}
                        className="px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-red-50 text-red-700 border border-red-200"
                      >
                        {bg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Contacts */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Transfusion Head:</span>
                    <strong className="text-slate-800 text-[11px] truncate max-w-[180px]">{hosp.contactPerson}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Direct Phone:</span>
                    <a href={`tel:${hosp.phone}`} className="font-mono text-slate-800 hover:underline">
                      {hosp.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-600 font-semibold text-[11px]">Emergency Hotline:</span>
                    <a href={`tel:${hosp.emergencyPhone}`} className="font-mono font-bold text-red-700 hover:underline flex items-center gap-1">
                      <PhoneCall className="w-3 h-3" />
                      {hosp.emergencyPhone}
                    </a>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Last Shipment: <strong className="text-slate-700">{hosp.lastShipment}</strong></span>
                  <span className={`font-semibold ${hosp.currentRequestStatus === 'Active' ? 'text-amber-600' : 'text-slate-400'}`}>
                    {hosp.currentRequestStatus === 'Active' ? '● 1 Active Requisition' : 'No open requisitions'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewHospitalRequests(hosp.id)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>View Requests</span>
                </button>

                <button
                  onClick={() => onRequestBloodForHospital(hosp)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                >
                  <span>Prepare Dispatch</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
