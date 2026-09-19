import React, { useState } from 'react';
import { ActiveNavPage, StaffUser } from '../../types';
import {
  LayoutDashboard,
  Boxes,
  QrCode,
  Building2,
  Inbox,
  Truck,
  Siren,
  BarChart3,
  Globe2,
  Bell,
  History,
  Users,
  Settings,
  Droplet,
  MapPin,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';

interface Props {
  activePage: ActiveNavPage;
  currentUser?: StaffUser;
  pendingRequestsCount: number;
  inTransitShipmentsCount: number;
  criticalStockCount: number;
  unreadNotificationsCount: number;
  currentRegion?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate: (page: ActiveNavPage) => void;
  onOpenScanModal: () => void;
  onOpenSosModal: () => void;
  onSelectRegion?: (region: string) => void;
}

const ODISHA_REGIONS = [
  'Bhubaneswar, Odisha',
  'Cuttack, Odisha',
  'Rourkela, Odisha',
  'Berhampur, Odisha',
  'Sambalpur, Odisha',
  'Puri, Odisha'
];

export const NgoSidebar: React.FC<Props> = ({
  activePage,
  currentUser,
  pendingRequestsCount,
  inTransitShipmentsCount,
  criticalStockCount,
  unreadNotificationsCount,
  currentRegion = 'Bhubaneswar, Odisha',
  isOpen = false,
  onClose,
  onNavigate,
  onOpenScanModal,
  onOpenSosModal,
  onSelectRegion
}) => {
  const [showRegionPicker, setShowRegionPicker] = useState(false);

  const navItems = [
    {
      id: 'dashboard' as ActiveNavPage,
      label: 'Main Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'inventory' as ActiveNavPage,
      label: 'Inventory Overview',
      icon: Boxes,
      badge: criticalStockCount > 0 ? `${criticalStockCount} Critical` : null,
      badgeColor: 'bg-red-100 text-red-700 ring-1 ring-red-200'
    },
    {
      id: 'blood-units' as ActiveNavPage,
      label: 'Blood Units Tracking',
      icon: Droplet,
      badge: null
    },
    {
      id: 'scan' as ActiveNavPage,
      label: 'Barcode Scanner',
      icon: QrCode,
      badge: 'Scan',
      badgeColor: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
    },
    {
      id: 'hospitals' as ActiveNavPage,
      label: 'Connected Hospitals',
      icon: Building2,
      badge: null
    },
    {
      id: 'requests' as ActiveNavPage,
      label: 'Hospital Requests',
      icon: Inbox,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : null,
      badgeColor: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200'
    },
    {
      id: 'shipments' as ActiveNavPage,
      label: 'Shipment Logistics',
      icon: Truck,
      badge: inTransitShipmentsCount > 0 ? `${inTransitShipmentsCount} en route` : null,
      badgeColor: 'bg-blue-100 text-blue-800 ring-1 ring-blue-200'
    },
    {
      id: 'emergency' as ActiveNavPage,
      label: 'Emergency SOS',
      icon: Siren,
      badge: 'SOS',
      badgeColor: 'bg-red-600 text-white font-bold'
    },
    {
      id: 'analytics' as ActiveNavPage,
      label: 'Analytics & Trends',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'network' as ActiveNavPage,
      label: 'NGO Network',
      icon: Globe2,
      badge: null
    },
    {
      id: 'notifications' as ActiveNavPage,
      label: 'Notification Center',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : null,
      badgeColor: 'bg-red-600 text-white'
    },
    {
      id: 'activity' as ActiveNavPage,
      label: 'Activity & Audit Log',
      icon: History,
      badge: null
    },
    {
      id: 'users' as ActiveNavPage,
      label: 'Staff & Roles',
      icon: Users,
      badge: null
    },
    {
      id: 'settings' as ActiveNavPage,
      label: 'Settings & Thresholds',
      icon: Settings,
      badge: null
    }
  ];

  const handleNavClick = (page: ActiveNavPage) => {
    onNavigate(page);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Left Sidebar - Locked at extreme left viewport (matches DonorReceiverView exact structure) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-30 flex h-screen w-64 flex-col justify-between border-r border-gray-100 bg-white shadow-xs transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Scrollable Navigation Section */}
        <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
          {/* Logo & Platform Header */}
          <div className="flex items-center justify-between px-5 py-5 shrink-0">
            <a
              href="/index.html"
              className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer"
              title="Return to LifeFlow Portal Gateway"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 shadow-sm">
                <Droplet className="h-5 w-5 text-white" fill="white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-lg font-bold text-gray-900 leading-tight">LifeFlow</span>
                <span className="text-[10px] font-semibold text-primary-600 tracking-wider uppercase">NGO Portal (Odisha)</span>
              </div>
            </a>

            {/* Mobile Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Location / Region Badge (Matches DonorReceiverView format) */}
          <div className="relative mx-4 mb-3 shrink-0">
            <div className="flex items-center justify-between rounded-xl bg-primary-50 px-3 py-2 ring-1 ring-primary-100">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary-600" />
                <span className="truncate text-sm font-semibold text-primary-700">{currentRegion}</span>
              </div>
              <button
                onClick={() => setShowRegionPicker(!showRegionPicker)}
                className="text-[11px] font-bold text-primary-600 hover:text-primary-800 hover:underline shrink-0 ml-1 cursor-pointer transition-colors"
                title="Change Region in Odisha"
              >
                Change
              </button>
            </div>

            {/* Region Switcher Popover */}
            {showRegionPicker && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white rounded-xl shadow-xl border border-gray-200 p-2 space-y-1 animate-in fade-in duration-150">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Select Odisha Regional Zone
                </div>
                {ODISHA_REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      if (onSelectRegion) onSelectRegion(r);
                      setShowRegionPicker(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      currentRegion === r
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span>{r}</span>
                    {currentRegion === r && <Check className="w-3.5 h-3.5 text-primary-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="px-3 pb-2 space-y-1.5 shrink-0">
            <button
              onClick={onOpenScanModal}
              className="w-full py-2 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>+ Add Unit (Scan)</span>
            </button>
            <button
              onClick={onOpenSosModal}
              className="w-full py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Siren className="w-3.5 h-3.5 text-red-600" />
              <span>Trigger SOS Alert</span>
            </button>
          </div>

          {/* Navigation Links (Matches DonorReceiverView navigation button format) */}
          <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Modules
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150 active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold ring-1 ring-primary-100 shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-primary-600' : 'text-gray-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${
                        item.badgeColor || 'bg-primary-100 text-primary-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile link & Return button - Always pinned at the very bottom (Matches DonorReceiverView) */}
        <div className="shrink-0 border-t border-gray-100 bg-white p-3 space-y-2">
          {/* Active Staff Member / NGO Card */}
          <div className="flex items-center gap-2.5 rounded-xl bg-gray-50 p-2.5 border border-gray-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700 font-bold text-xs shrink-0">
              {currentUser?.name?.slice(0, 2).toUpperCase() || 'OD'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-gray-900">
                {currentUser?.name || 'Odisha Red Cross Society'}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="truncate">{currentUser?.role || 'Blood Bank Officer'}</span>
              </div>
            </div>
          </div>

          {/* Return to LifeFlow Gateway Button */}
          <a
            href="/index.html"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-2.5 px-3 text-xs font-semibold text-gray-700 transition-all duration-150 hover:bg-primary-50 hover:text-primary-700 hover:ring-1 hover:ring-primary-200 active:scale-95 cursor-pointer"
            title="Return to LifeFlow Portal Gateway"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-primary-600 transition-transform duration-150 group-hover:-translate-x-0.5" />
            <span>Return to Gateway</span>
          </a>
        </div>
      </aside>
    </>
  );
};
