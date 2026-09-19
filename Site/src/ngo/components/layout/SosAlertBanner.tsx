import React from 'react';
import { SosAlert, BloodInventoryItem } from '../../types';
import { AlertTriangle, Siren, ShieldAlert, ArrowRight } from 'lucide-react';

interface Props {
  sosAlert: SosAlert;
  inventory: BloodInventoryItem[];
  onOpenEmergencyView: () => void;
  onDeactivate: () => void;
}

export const SosAlertBanner: React.FC<Props> = ({
  sosAlert,
  inventory,
  onOpenEmergencyView,
  onDeactivate
}) => {
  // Check if any blood group has critical status
  const criticalItems = inventory.filter((i) => i.status === 'Critical');

  if (!sosAlert.isActive && criticalItems.length === 0) {
    return null;
  }

  return (
    <aside aria-label="Critical alerts" className="w-full">
      {sosAlert.isActive ? (
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white px-4 py-3 shadow-lg border-b border-red-800 animate-pulse">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Siren className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-wide uppercase px-2 py-0.5 bg-white text-red-700 rounded text-xs">
                    ACTIVE SOS EMERGENCY
                  </span>
                  <span className="font-bold text-red-100">
                    {sosAlert.hospitalName}
                  </span>
                </div>
                <p className="text-red-50 text-xs md:text-sm mt-0.5">
                  Critical Shortage: <strong className="text-white underline">{sosAlert.bloodGroup}</strong> • 
                  Needed: <strong>{sosAlert.requiredUnits} Units</strong> • 
                  Available: <strong>{sosAlert.availableUnits} Units</strong> • 
                  Shortage: <span className="bg-red-900/80 px-1.5 py-0.5 rounded font-bold text-yellow-300">{sosAlert.shortageUnits} Units</span> • 
                  Deadline: <strong>{sosAlert.requiredBy}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenEmergencyView}
                className="px-3 py-1.5 bg-white text-red-700 hover:bg-red-50 rounded-lg font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Emergency Control Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onDeactivate}
                className="px-3 py-1.5 bg-red-800/80 hover:bg-red-900 text-white rounded-lg text-xs font-medium transition"
              >
                Stand Down
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Threshold Warning:</strong> Blood group(s){' '}
                <span className="font-bold text-red-700">
                  {criticalItems.map((c) => `${c.bloodGroup} (${c.currentUnits} units)`).join(', ')}
                </span>{' '}
                are critically below safety threshold (&lt;100 units).
              </span>
            </div>
            <button
              onClick={onOpenEmergencyView}
              className="text-amber-800 hover:text-amber-950 font-semibold underline ml-3 shrink-0 flex items-center gap-1"
            >
              <span>Manage Shortage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
