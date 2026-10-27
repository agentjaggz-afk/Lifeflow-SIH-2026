import React, { useState, useEffect, useRef } from 'react';
import { User, ChevronDown, ShieldCheck, LogOut, Award, Droplet, ArrowRight, Home, CheckCircle2 } from 'lucide-react';

interface UserProfileMenuProps {
  currentCity?: string;
  variant?: 'header' | 'sidebar' | 'dark';
}

export function UserProfileMenu({ currentCity, variant = 'header' }: UserProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState<string>('Rahul Sharma');
  const [userRole, setUserRole] = useState<string>('donor');
  const [userEmail, setUserEmail] = useState<string>('');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');

  useEffect(() => {
    try {
      const storedName =
        localStorage.getItem('lifeflow_user_name') ||
        localStorage.getItem('bloodlinkUserName');
      if (storedName && storedName.trim()) {
        setUserName(storedName.trim());
      }

      const storedRole =
        localStorage.getItem('lifeflow_user_role') ||
        localStorage.getItem('bloodlinkUserRole');
      if (storedRole && storedRole.trim()) {
        setUserRole(storedRole.trim().toLowerCase());
      }

      const storedEmail =
        localStorage.getItem('lifeflow_user_email') ||
        localStorage.getItem('bloodlinkUserEmail');
      if (storedEmail && storedEmail.trim()) {
        setUserEmail(storedEmail.trim());
      } else {
        const cleanName = (storedName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '.');
        setUserEmail(`${cleanName}@gmail.com`);
      }

      const storedBg =
        localStorage.getItem('bloodlinkUserBloodGroup') ||
        localStorage.getItem('lifeflow_blood_group');
      if (storedBg && storedBg.trim()) {
        setBloodGroup(storedBg.trim());
      }
    } catch (e) {
      console.error('Failed to read user data from localStorage', e);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const isDonor = userRole === 'donor';
  const roleLabel = isDonor ? 'Blood Donor' : 'Recipient / Consumer';

  const handleSignOut = () => {
    try {
      localStorage.removeItem('lifeflow_authenticated');
      localStorage.removeItem('bloodlinkIsAuthenticated');
    } catch {
      // Ignore storage errors on sign-out
    }
    window.location.replace('/index.html');
  };

  if (variant === 'sidebar') {
    return (
      <div ref={menuRef} className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group flex w-full items-center gap-2.5 rounded-xl bg-gray-50 px-3 py-2.5 ring-1 ring-gray-200 transition-all duration-200 hover:bg-primary-50 hover:ring-primary-200 active:scale-95 text-left cursor-pointer"
          title="Click to view your Account & Profile details"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-500 text-xs font-bold text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
            {initials}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-xs font-bold text-gray-900">{userName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${isDonor ? 'bg-emerald-500' : 'bg-orange-500'}`} />
              <p className="truncate text-[10px] font-medium text-gray-500">{roleLabel}</p>
            </div>
          </div>
          <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-600' : 'group-hover:text-gray-600'}`} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-72 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 z-50 animate-fade-in text-gray-800">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-500 text-sm font-bold text-white shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="truncate text-sm font-bold text-gray-900">{userName}</h4>
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                </div>
                <p className="truncate text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="my-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg bg-gray-50 p-2 text-center ring-1 ring-gray-100">
                <span className="text-gray-400 block text-[10px]">ROLE</span>
                <span className="font-bold text-gray-800">{isDonor ? 'Donor' : 'Recipient'}</span>
              </div>
              <div className="rounded-lg bg-primary-50 p-2 text-center ring-1 ring-primary-100">
                <span className="text-primary-600 block text-[10px]">BLOOD GROUP</span>
                <span className="font-bold text-primary-700">{bloodGroup}</span>
              </div>
            </div>

            {/* Action Links */}
            <div className="space-y-1 text-xs">
              <a
                href="/credit.html"
                className="flex items-center justify-between rounded-lg px-2.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>Credits & Rewards</span>
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
              <a
                href="/index.html"
                className="flex items-center justify-between rounded-lg px-2.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-500" />
                  <span>Portal Gateway (Home)</span>
                </span>
                <ArrowRight className="h-3 w-3 text-gray-400" />
              </a>
            </div>

            {/* Sign Out */}
            <div className="mt-3 border-t border-gray-100 pt-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Switch Account / Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Header variant (light or dark mode depending on prop)
  const isDark = variant === 'dark';

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2.5 rounded-full px-3 py-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${
          isDark
            ? 'bg-white/10 text-white hover:bg-white/20 ring-1 ring-white/20'
            : 'bg-white text-gray-800 hover:bg-gray-50 shadow-xs ring-1 ring-gray-200 hover:ring-primary-300'
        }`}
        title={`Signed in as ${userName} (${roleLabel}) - Click for profile options`}
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-500 text-[11px] font-bold text-white shadow-xs">
          {initials}
        </div>
        <div className="hidden sm:block text-left leading-none max-w-[130px] md:max-w-[180px]">
          <span className="block truncate text-xs font-bold">{userName}</span>
          <span className={`block text-[10px] mt-0.5 truncate ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
            {roleLabel}
          </span>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary-600' : isDark ? 'text-white/70' : 'text-gray-400'
          }`}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] origin-top-right rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 z-50 animate-fade-in text-gray-800">
          {/* User Header */}
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-500 text-sm font-bold text-white shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="truncate text-sm font-bold text-gray-900">{userName}</h4>
                <span title="Verified LifeFlow Account" className="inline-flex items-center">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                </span>
              </div>
              <p className="truncate text-xs text-gray-500">{userEmail}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Active Session
                </span>
              </div>
            </div>
          </div>

          {/* Account Details Box */}
          <div className="my-3 grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-xl bg-gray-50 p-2.5 text-center ring-1 ring-gray-100">
              <span className="text-gray-400 block text-[10px] font-semibold uppercase">Account Type</span>
              <span className="font-bold text-gray-800">{roleLabel}</span>
            </div>
            <div className="rounded-xl bg-primary-50 p-2.5 text-center ring-1 ring-primary-100">
              <span className="text-primary-600 block text-[10px] font-semibold uppercase">Blood Group</span>
              <span className="font-bold text-primary-700">{bloodGroup}</span>
            </div>
          </div>

          {currentCity && (
            <div className="mb-3 rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600 flex items-center justify-between">
              <span className="text-[11px] text-gray-500">Selected City:</span>
              <span className="font-semibold text-gray-800">{currentCity}</span>
            </div>
          )}

          {/* Links */}
          <div className="space-y-1 text-xs">
            <a
              href="/credit.html"
              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Credit Points & Rewards</span>
              </span>
              <ArrowRight className="h-3 w-3 text-gray-400" />
            </a>

            <a
              href="/index.html"
              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="font-medium">All Portals Gateway</span>
              </span>
              <ArrowRight className="h-3 w-3 text-gray-400" />
            </a>
          </div>

          {/* Footer / Sign Out */}
          <div className="mt-3 border-t border-gray-100 pt-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Switch Account / Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
