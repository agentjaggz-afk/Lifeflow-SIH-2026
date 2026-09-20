import React from 'react';
import { ActiveNavPage } from '../../types';
import {
  LayoutDashboard,
  Boxes,
  QrCode,
  Inbox,
  Siren,
  X,
  Droplet,
  Building2,
  Truck,
  BarChart3,
  Globe2,
  Bell,
  History,
  Users,
  Settings
} from 'lucide-react';

interface Props {
  activePage: ActiveNavPage;
  isOpen: boolean;
  unreadNotifications: number;
  pendingRequests: number;
  onClose: () => void;
  onNavigate: (page: ActiveNavPage) => void;
  onOpenScanModal: () => void;
  onOpenSosModal: () => void;
}

export const NgoMobileNav: React.FC<Props> = ({
  activePage,
  isOpen,
  unreadNotifications,
  pendingRequests,
  onClose,
  onNavigate,
  onOpenScanModal,
  onOpenSosModal
}) => {
  const drawerLinks = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory Overview', icon: Boxes },
    { id: 'blood-units', label: 'Blood Units Table', icon: Droplet },
    { id: 'hospitals', label: 'Connected Hospitals', icon: Building2 },
    { id: 'requests', label: 'Hospital Requests', icon: Inbox, badge: pendingRequests },
    { id: 'shipments', label: 'Shipment Logistics', icon: Truck },
    { id: 'emergency', label: 'Emergency SOS', icon: Siren },
    { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3 },
    { id: 'network', label: 'NGO Network', icon: Globe2 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'activity', label: 'Activity & Audit Log', icon: History },
    { id: 'users', label: 'Staff & Roles', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Slide-Over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <a href="/index.html" className="flex items-center hover:opacity-85 transition-opacity" title="Life Flow">
                <img src="/lifeflow-logo.png" alt="Life Flow" className="h-12 w-auto object-contain" />
              </a>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenSosModal();
                }}
                className="w-full py-2 px-3 bg-red-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Siren className="w-4 h-4" />
                <span>🚨 Emergency SOS Alert</span>
              </button>
            </div>

            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
              {drawerLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id as ActiveNavPage);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-red-50 text-red-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Fixed Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 py-1 shadow-lg">
        <div className="flex items-center justify-around">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] ${
              activePage === 'dashboard' ? 'text-red-600 font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onNavigate('inventory')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] ${
              activePage === 'inventory' ? 'text-red-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Stock</span>
          </button>

          {/* Prominent Center Scan Button */}
          <button
            onClick={onOpenScanModal}
            className="flex flex-col items-center -mt-4"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-300">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-red-700 mt-0.5">Scan</span>
          </button>

          <button
            onClick={() => onNavigate('requests')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] relative ${
              activePage === 'requests' ? 'text-red-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Requests</span>
            {pendingRequests > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-amber-500 rounded-full"></span>
            )}
          </button>

          <button
            onClick={onOpenSosModal}
            className="flex flex-col items-center py-1 px-2 text-[10px] text-red-600 font-bold"
          >
            <Siren className="w-4 h-4 animate-bounce" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </>
  );
};
