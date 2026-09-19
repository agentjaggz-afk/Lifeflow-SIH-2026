import React, { useState, useMemo } from 'react';
import { NgoNetworkPeer, BloodGroup, BLOOD_GROUPS } from '../../types';
import {
  Globe2,
  Search,
  MapPin,
  Phone,
  Radio,
  ShieldCheck,
  Building,
  Filter,
  SlidersHorizontal,
  Send,
  Lock
} from 'lucide-react';

interface Props {
  peers: NgoNetworkPeer[];
  onRequestInterNgoTransfer: (peerName: string, bloodGroup: BloodGroup, units: number) => void;
}

export const NgoNetworkView: React.FC<Props> = ({ peers, onRequestInterNgoTransfer }) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('O-');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter peers by radius, available group, and search query
  const filteredPeers = useMemo(() => {
    return peers.filter((p) => {
      if (p.distanceKm > maxRadiusKm) return false;
      if (selectedGroup !== 'ALL') {
        const hasGroup = p.availableGroups.some((g) => g.group === selectedGroup && g.units > 0);
        if (!hasGroup) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
      }
      return true;
    });
  }, [peers, selectedGroup, maxRadiusKm, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-red-600" />
            <span>State Blood Transfusion NGO & Blood Bank Federation</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inter-institutional inventory discovery grid. Search partner blood banks within dynamic radii.
          </p>
        </div>

        {/* Privacy Shield Notice */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-[11px] text-slate-600 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Donor PII Strictly Anonymized</span>
        </div>
      </div>

      {/* Discovery Query Bar (e.g. "Find O- units within 100 km") */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Regional Stock Discovery Radius Search
          </h3>
          <span className="text-xs font-bold text-red-600 font-mono">
            Radius: ≤ {maxRadiusKm} km
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Target Blood Group */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Find Units of Blood Group:
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500"
            >
              <option value="ALL">All Available Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>Blood Group {bg}</option>
              ))}
            </select>
          </div>

          {/* Distance Slider */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Search Within Distance:
            </label>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={maxRadiusKm}
                onChange={(e) => setMaxRadiusKm(parseInt(e.target.value))}
                className="w-full accent-red-600"
              />
              <span className="font-mono text-xs font-bold text-slate-800 w-14 shrink-0">
                {maxRadiusKm} km
              </span>
            </div>
          </div>

          {/* Text Search */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Filter by Organization Name / City:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. LifeSavers, Samarpan, Rotary..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Matching Peer Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPeers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            No partner organizations found matching {selectedGroup} within {maxRadiusKm} km.
          </div>
        ) : (
          filteredPeers.map((peer) => {
            return (
              <div
                key={peer.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {peer.name}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{peer.location} • <strong className="text-slate-700 font-mono">{peer.distanceKm} km</strong></span>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Sync: {peer.lastSync}
                    </span>
                  </div>

                  {/* Available Blood Groups Breakdown */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Live Available Blood Reserves
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {peer.availableGroups.map((g) => (
                        <div
                          key={g.group}
                          className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                            g.group === selectedGroup
                              ? 'bg-red-50 border-red-300 font-bold'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <span className="font-mono text-slate-800">{g.group}</span>
                          <span className={`font-mono font-bold ${
                            g.units < 100
                              ? 'text-red-600'
                              : g.units <= 150
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}>
                            {g.units} units
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                    <div>Officer: <strong className="text-slate-800">{peer.contact}</strong></div>
                    <div>Phone: <a href={`tel:${peer.phone}`} className="font-mono text-slate-800 hover:underline">{peer.phone}</a></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => onRequestInterNgoTransfer(peer.name, (selectedGroup !== 'ALL' ? selectedGroup : 'O-'), 4)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Initiate Inter-NGO Transfer</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
