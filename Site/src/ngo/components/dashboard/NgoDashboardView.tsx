import React, { useState } from 'react';
import {
  BloodGroup,
  BloodUnit,
  ActiveNavPage,
  HospitalRequest,
  Shipment
} from '../../types';
import { NgoPlatformState } from '../../services/ngoStateService';
import { QuickActions } from './QuickActions';
import { BloodStockGrid } from './BloodStockGrid';
import { ExpiringOverview } from './ExpiringOverview';
import { RecentActivityWidget } from './RecentActivityWidget';
import {
  Radio,
  Clock,
  ShieldCheck,
  Building2,
  Inbox,
  Truck,
  ArrowRight,
  MapPin,
  Check,
  ChevronDown
} from 'lucide-react';
import {
  getRegionalCenter,
  ODISHA_REGIONAL_CENTERS,
  DEFAULT_ODISHA_REGION
} from '../../services/regionalConfig';

interface Props {
  state: NgoPlatformState;
  currentRegion?: string;
  onSelectRegion?: (region: string) => void;
  onNavigate: (page: ActiveNavPage) => void;
  onOpenScanModal: () => void;
  onOpenManualModal: () => void;
  onOpenSosModal: () => void;
  onPrioritizeUnit: (unitId: string) => void;
  onFilterGroup: (group: BloodGroup) => void;
}

export const NgoDashboardView: React.FC<Props> = ({
  state,
  currentRegion = DEFAULT_ODISHA_REGION,
  onSelectRegion,
  onNavigate,
  onOpenScanModal,
  onOpenManualModal,
  onOpenSosModal,
  onPrioritizeUnit,
  onFilterGroup
}) => {
  const [showRegionMenu, setShowRegionMenu] = useState(false);

  const center = getRegionalCenter(currentRegion);

  // Derive regional personnel and facility names
  const displayFacility = center.facilityName;
  const displayPersonnel =
    state.currentUser.name && state.currentUser.name !== 'Rahul Sharma'
      ? state.currentUser.name
      : center.inventoryManager;

  const pendingRequests = state.requests.filter((r: HospitalRequest) => r.status === 'Pending').length;
  const inTransitShipments = state.shipments.filter((s: Shipment) => s.status === 'In Transit').length;

  return (
    <div className="space-y-6">
      {/* Operational Control Center Header - Regionalized to selected Odisha region */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          {/* Top Line: Title + Live Sync + Regional Location Pill */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Operational Control Center
            </h1>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Radio className="w-3 h-3 animate-pulse text-emerald-600" />
              Real-Time Sync Active
            </span>

            {/* Interactive Region Selector Pill */}
            <div className="relative inline-flex items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-primary-50 text-primary-700 ring-1 ring-primary-200 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                <span>{center.regionKey}</span>
                {onSelectRegion && (
                  <button
                    onClick={() => setShowRegionMenu(!showRegionMenu)}
                    className="ml-1 text-[11px] font-bold text-primary-600 hover:text-primary-800 hover:underline cursor-pointer transition"
                    title="Switch Regional Operational Center"
                  >
                    Change
                  </button>
                )}
              </div>

              {/* Regional Dropdown Menu */}
              {showRegionMenu && onSelectRegion && (
                <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in duration-150">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Select Odisha Regional Zone
                  </div>
                  {Object.keys(ODISHA_REGIONAL_CENTERS).map((regionKey) => (
                    <button
                      key={regionKey}
                      onClick={() => {
                        onSelectRegion(regionKey);
                        setShowRegionMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        currentRegion === regionKey
                          ? 'bg-primary-50 text-primary-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{regionKey}</span>
                      {currentRegion === regionKey && (
                        <Check className="w-3.5 h-3.5 text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subtitle Line: Logged In Personnel & Regional Blood Bank Facility */}
          <div className="text-xs text-slate-600 mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              Logged in as <strong>{displayPersonnel}</strong> ({state.currentUser.role})
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-900">
              {displayFacility}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
              Lic: {center.facilityLicense}
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline text-slate-500 text-[11px]">
              {center.hubAddress}
            </span>
          </div>
        </div>

        {/* Status Chips - Regionalized Context */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div
            onClick={() => onNavigate('requests')}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl cursor-pointer transition flex items-center gap-2 shadow-2xs"
            title={`View pending requisitions in ${center.city} Zone`}
          >
            <Inbox className="w-4 h-4 text-amber-600" />
            <span><strong>{pendingRequests}</strong> Pending Hospital Requests</span>
            <span className="text-[10px] font-semibold bg-amber-200/60 px-1.5 py-0.5 rounded text-amber-800">
              {center.city} Zone
            </span>
          </div>

          <div
            onClick={() => onNavigate('shipments')}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-xl cursor-pointer transition flex items-center gap-2 shadow-2xs"
            title={`View cold-chain shipments for ${center.city}`}
          >
            <Truck className="w-4 h-4 text-blue-600" />
            <span><strong>{inTransitShipments}</strong> Active Cold Shipments</span>
            <span className="text-[10px] font-semibold bg-blue-200/60 px-1.5 py-0.5 rounded text-blue-800">
              Cold Vault: 4.1°C
            </span>
          </div>
        </div>
      </div>

      {/* Large Quick Actions Grid (Section 24) */}
      <QuickActions
        onOpenScanModal={onOpenScanModal}
        onOpenManualModal={onOpenManualModal}
        onOpenSosModal={onOpenSosModal}
        onNavigate={onNavigate}
      />

      {/* Live Blood Group Inventory Grid (Section 3: A+, A-, B+, B-, AB+, AB-, O+, O-) */}
      <BloodStockGrid
        inventory={state.inventory}
        onQuickAdd={(group) => {
          onOpenManualModal();
        }}
        onManualAdjust={(group) => {
          onOpenManualModal();
        }}
        onFilterUnits={onFilterGroup}
      />

      {/* Expiring Overview and Recent Activity Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpiringOverview
          bloodUnits={state.bloodUnits}
          onPrioritize={onPrioritizeUnit}
          onViewAllExpiring={() => onNavigate('inventory')}
        />
        <RecentActivityWidget
          activities={state.activityLogs}
          onViewAllActivity={() => onNavigate('activity')}
        />
      </div>
    </div>
  );
};
