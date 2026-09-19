import React, { useState, useEffect, useRef } from 'react';
import {
  NgoProfile,
  AppNotification,
  StaffUser,
  ActiveNavPage,
  SosAlert
} from '../../types';
import {
  Bell,
  CheckCircle,
  Siren,
  ChevronDown,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Radio,
  Clock,
  Menu,
  User,
  QrCode,
  ThermometerSnowflake
} from 'lucide-react';

interface Props {
  profile: NgoProfile;
  currentUser: StaffUser;
  staffUsers: StaffUser[];
  notifications: AppNotification[];
  sosAlert: SosAlert;
  activePage: ActiveNavPage;
  currentRegion?: string;
  onNavigate: (page: ActiveNavPage) => void;
  onOpenSosModal: () => void;
  onOpenScanModal?: () => void;
  onSelectUser: (user: StaffUser) => void;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onToggleMobileSidebar: () => void;
  onLogout: () => void;
}

export const NgoNavbar: React.FC<Props> = ({
  profile,
  currentUser,
  staffUsers,
  notifications,
  sosAlert,
  activePage,
  currentRegion = 'Bhubaneswar, Odisha',
  onNavigate,
  onOpenSosModal,
  onOpenScanModal,
  onSelectUser,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onToggleMobileSidebar,
  onLogout
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Live digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const pageTitles: Record<string, string> = {
    dashboard: 'Main Dashboard',
    inventory: 'Blood Inventory Overview',
    'blood-units': 'Blood Units Tracking',
    scan: 'Barcode Intake & Verification',
    hospitals: 'Connected Hospitals Registry',
    requests: 'Hospital Blood Requests',
    shipments: 'Cold-Chain Shipment Logistics',
    emergency: 'Emergency SOS Command Center',
    analytics: 'Analytics & Regional Forecasting',
    network: 'Odisha NGO & Blood Bank Network',
    notifications: 'Notification Center',
    activity: 'Audit & Compliance Log',
    users: 'Staff & Role Management',
    settings: 'Threshold & System Settings'
  };

  const title = pageTitles[activePage] || 'Operational Center';

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white/85 px-4 sm:px-6 py-3.5 backdrop-blur-md">
      
      {/* Left side: Mobile Toggle + Title + Odisha regional crumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 -ml-1.5 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate">
            {title}
          </h1>
          <span className="hidden sm:inline text-xs font-medium text-gray-400 shrink-0">
            • {currentRegion}
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 shrink-0">
            <ShieldCheck className="w-3 h-3" />
            SBTC Odisha Verified
          </span>
        </div>
      </div>

      {/* Right side: Clock, Cold-Chain, SOS, Quick Add, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* Cold-chain sensor status */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg">
          <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[11px]">Cold Vault:</span>
          <span className="font-mono text-[11px] font-semibold text-emerald-600">4.1°C</span>
        </div>

        {/* Live Digital Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>{currentTime}</span>
        </div>

        {/* Scan / Add Unit Button */}
        {onOpenScanModal && (
          <button
            onClick={onOpenScanModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 ring-1 ring-primary-200 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan Unit</span>
          </button>
        )}

        {/* Emergency SOS Button */}
        <button
          onClick={onOpenSosModal}
          className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
            sosAlert.isActive
              ? 'bg-red-600 text-white animate-pulse hover:bg-red-700 shadow-sm shadow-red-200'
              : 'bg-red-50 hover:bg-red-100 text-red-700 ring-1 ring-red-200'
          }`}
          title="Emergency Blood Shortage SOS"
        >
          <Siren className="w-3.5 h-3.5 text-red-600" />
          <span className="hidden sm:inline">SOS Alert</span>
          <span className="sm:hidden">SOS</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition focus:outline-hidden cursor-pointer"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in duration-150">
              <div className="p-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-[11px] font-semibold text-primary-600 hover:text-primary-800 transition cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    No notifications at this moment.
                  </div>
                ) : (
                  notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-3 text-xs transition cursor-pointer hover:bg-gray-50 ${
                        notif.read ? 'bg-white opacity-80' : 'bg-red-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-gray-900 truncate">{notif.title}</span>
                        <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-600 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    onNavigate('notifications');
                  }}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-800 cursor-pointer"
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu & Role Switcher */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-100 transition cursor-pointer focus:outline-hidden"
          >
            <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[110px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-gray-500 truncate max-w-[110px]">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-2 space-y-1 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900 truncate">{profile.name}</p>
                <p className="text-[11px] font-mono text-gray-500">Lic: {profile.licenseNumber}</p>
              </div>

              {/* Personnel switcher */}
              <div className="py-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Switch Active Personnel
                </div>
                {staffUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                      currentUser.id === user.id
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="truncate">{user.name}</p>
                      <p className="text-[10px] text-gray-400">{user.role}</p>
                    </div>
                    {currentUser.id === user.id && (
                      <span className="w-2 h-2 rounded-full bg-primary-600"></span>
                    )}
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('settings');
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  System & Threshold Settings
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
