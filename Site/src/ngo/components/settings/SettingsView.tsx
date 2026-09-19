import React, { useState } from 'react';
import { NgoProfile, BloodInventoryItem, BloodGroup } from '../../types';
import {
  Settings,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Bell,
  Lock,
  Building,
  Check,
  AlertTriangle,
  QrCode,
  Save
} from 'lucide-react';

interface Props {
  profile: NgoProfile;
  inventory: BloodInventoryItem[];
  onUpdateProfile: (profile: Partial<NgoProfile>) => void;
  onUpdateThreshold: (bloodGroup: BloodGroup, val: number) => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<Props> = ({
  profile,
  inventory,
  onUpdateProfile,
  onUpdateThreshold,
  onResetDemoData
}) => {
  const [name, setName] = useState(profile.name);
  const [license, setLicense] = useState(profile.licenseNumber);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [hotline, setHotline] = useState(profile.emergencyHotline);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local state for thresholds
  const [thresholds, setThresholds] = useState<Record<BloodGroup, number>>(() => {
    const map: any = {};
    inventory.forEach((i) => {
      map[i.bloodGroup] = i.minThreshold;
    });
    return map;
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      licenseNumber: license,
      email,
      phone,
      address,
      emergencyHotline: hotline
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleThresholdChange = (group: BloodGroup, val: number) => {
    setThresholds((prev) => ({ ...prev, [group]: val }));
    onUpdateThreshold(group, val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-600" />
            <span>Platform Configuration & Operational Thresholds</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize minimum reserve stock trigger levels, cold storage parameters, and organizational identity.
          </p>
        </div>

        {/* Demo Reset Button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all demo data back to clean prototype baseline?')) {
              onResetDemoData();
            }
          }}
          className="px-3.5 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Prototype Demo Data</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Configuration parameters updated and saved to persistent store!</span>
        </div>
      )}

      {/* SECTION A: INVENTORY THRESHOLDS CONFIGURATION (Requirement #14 & #20) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-red-600" />
              <span>Automatic Low-Stock Trigger Thresholds</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Whenever inventory drops below these numbers, the platform automatically flags CRITICAL alerts and suggests nearby peer supplies.
            </p>
          </div>
          <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-lg border border-red-200">
            Real-Time Threshold Watcher Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {inventory.map((item) => {
            const currentVal = thresholds[item.bloodGroup] || item.minThreshold;

            return (
              <div
                key={item.bloodGroup}
                className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-extrabold text-sm flex items-center justify-center font-mono">
                    {item.bloodGroup}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Stock:{' '}
                    <strong
                      className={
                        item.currentUnits < 100
                          ? 'text-red-600 font-bold'
                          : item.currentUnits <= 150
                          ? 'text-amber-600 font-bold'
                          : 'text-emerald-600 font-bold'
                      }
                    >
                      {item.currentUnits}
                    </strong>
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Min Threshold:</span>
                    <span className="font-mono font-bold text-red-700">{currentVal} units</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={currentVal}
                    onChange={(e) => handleThresholdChange(item.bloodGroup, parseInt(e.target.value))}
                    className="w-full accent-red-600"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION B: ORGANIZATION PROFILE */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-700" />
              <span>Institutional Organization Profile</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Official entity details registered with State & National Blood Transfusion Council.
            </p>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              NGO / Blood Bank Official Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Statutory License Number
            </label>
            <input
              type="text"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Administrative Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Official Telephone / Landline
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">
              Facility Physical Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Emergency 24x7 Hotline Number
            </label>
            <input
              type="text"
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-red-700 font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              State Accreditation Status
            </label>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Statutory Blood Bank Organization</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
