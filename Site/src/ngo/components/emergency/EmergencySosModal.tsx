import React, { useState } from 'react';
import { BloodGroup, BLOOD_GROUPS, ConnectedHospital } from '../../types';
import { Siren, AlertTriangle, X, Radio, Clock, Building2, Send, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  hospitals: ConnectedHospital[];
  onClose: () => void;
  onActivate: (params: {
    bloodGroup: BloodGroup;
    requiredUnits: number;
    hospitalName: string;
    requiredBy: string;
    message: string;
    broadcastRadiusKm?: number;
  }) => void;
}

export const EmergencySosModal: React.FC<Props> = ({
  isOpen,
  hospitals,
  onClose,
  onActivate
}) => {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [requiredUnits, setRequiredUnits] = useState(15);
  const [hospitalName, setHospitalName] = useState(hospitals[0]?.name || 'Apollo Speciality Hospital');
  const [requiredBy, setRequiredBy] = useState('8:00 PM Today');
  const [message, setMessage] = useState('Mass casualty highway accident. Critical universal uncrossmatched red blood cells urgently needed.');
  const [broadcastRadius, setBroadcastRadius] = useState(50);
  const [confirmedWarning, setConfirmedWarning] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedWarning) return;

    onActivate({
      bloodGroup,
      requiredUnits,
      hospitalName,
      requiredBy,
      message,
      broadcastRadiusKm: broadcastRadius
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-red-500 overflow-hidden animate-in zoom-in-95">
        
        {/* Urgent Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Siren className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-wide">
                Activate Emergency SOS Alert
              </h3>
              <p className="text-xs text-red-100">
                Broadcasts immediate distress requisition across regional grid
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>
              <strong>Are you sure you want to activate an emergency blood alert?</strong> This will trigger real-time push alerts to all affiliated hospitals, registered blood banks, and verified voluntary donor networks.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Distress Blood Group <span className="text-red-500">*</span>
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Required Units Needed <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={requiredUnits}
                onChange={(e) => setRequiredUnits(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Emergency Hospital Facility <span className="text-red-500">*</span>
            </label>
            <select
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
            >
              {hospitals.map((h) => (
                <option key={h.id} value={h.name}>{h.name} ({h.location})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Required-By Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={requiredBy}
              onChange={(e) => setRequiredBy(e.target.value)}
              placeholder="e.g. 8:00 PM Today"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Emergency Broadcast Dispatch Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-700">Broadcast Radius Alert</span>
              <span className="font-mono text-red-600 font-bold">{broadcastRadius} km</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              step="10"
              value={broadcastRadius}
              onChange={(e) => setBroadcastRadius(parseInt(e.target.value))}
              className="w-full accent-red-600"
            />
          </div>

          {/* Mandatory Confirmation Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={confirmedWarning}
                onChange={(e) => setConfirmedWarning(e.target.checked)}
                className="rounded-sm text-red-600 mt-0.5"
              />
              <span>
                I confirm this is an authentic life-threatening clinical shortage and authorize high-priority broadcasting.
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!confirmedWarning}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-300"
            >
              <Siren className="w-4 h-4 animate-bounce" />
              <span>Broadcast SOS Emergency</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
