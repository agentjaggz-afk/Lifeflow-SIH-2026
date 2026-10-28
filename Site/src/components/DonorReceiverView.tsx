import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Droplet, Users, Building2, Calendar, Phone, MapPin,
  Plus, AlertCircle, CheckCircle2, Clock, Heart, Activity, Search,
  TrendingUp, TrendingDown, X, User, PhoneCall, MessageSquare, Send,
  Navigation, Menu,
} from 'lucide-react';
import {
  BLOOD_GROUPS,
  type BloodGroup,
  type BloodInventory,
  type Donor,
  type BloodRequest,
  type BloodCamp,
  type Hospital,
} from '@/lib/supabase';
import {
  getOfflineHospitals,
  getOfflineInventory,
  getOfflineDonors,
  getOfflineRequests,
  getOfflineCamps,
  addOfflineDonor,
  addOfflineRequest,
  deleteOfflineDonor,
  deleteOfflineRequest,
  isManualDonor,
  isManualRequest,
  clearAllManualDonors,
  clearAllManualRequests,
  cleanIndianPhoneInput,
  validateIndianPhoneNumber,
} from '@/lib/offlineData';
import { UserProfileMenu } from '@/components/UserProfileMenu';

interface DonorReceiverViewProps {
  city: string;
  coords: { lat: number; lng: number } | null;
  onBack: () => void;
  onSelectHospital: (hospital: Hospital) => void;
}

type Tab = 'dashboard' | 'donors' | 'requests' | 'camps';

export function DonorReceiverView({ city, coords, onBack, onSelectHospital }: DonorReceiverViewProps) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inventory, setInventory] = useState<BloodInventory[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [camps, setCamps] = useState<BloodCamp[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    const hospList = getOfflineHospitals(city);
    const hospIds = hospList.map((h) => h.id);
    const invList = getOfflineInventory(hospIds);
    const donorList = getOfflineDonors(city);
    const reqList = getOfflineRequests(city);
    const campList = getOfflineCamps(city);

    setHospitals(hospList);
    setInventory(invList);
    setDonors(donorList);
    setRequests(reqList);
    setCamps(campList);
    setLoading(false);
  }, [city]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const navItems = [
    { id: 'dashboard' as Tab, label: 'Overview', icon: Activity, desc: 'Real-time blood stock summary' },
    { id: 'donors' as Tab, label: 'Voluntary Donors', icon: Users, desc: 'Find registered local donors' },
    { id: 'requests' as Tab, label: 'Blood Requests', icon: AlertCircle, desc: 'Urgent patient blood needs' },
    { id: 'camps' as Tab, label: 'Donation Camps', icon: Calendar, desc: 'Upcoming community drives' },
  ];

  return (
    <div className="min-h-screen bg-[#fdf6f3]">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-950/60 backdrop-blur-xs md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close navigation sidebar"
        />
      )}

      {/* Side Navigation Bar - Locked at viewport on desktop, slide-over drawer on mobile */}
      <aside
        className={`fixed top-0 left-0 bottom-0 h-screen flex flex-col justify-between border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out z-50 md:z-30 w-72 md:w-64 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0 md:shadow-xs'
        }`}
      >
        {/* Top Scrollable Navigation Section */}
        <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
          {/* Logo & Mobile Close button */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0">
            <a href="/index.html" className="flex items-center hover:opacity-85 transition-opacity cursor-pointer" title="Return to Portal Gateway">
              <img src="/lifeflow-logo.png" alt="Life Flow" className="h-11 md:h-14 w-auto object-contain" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 active:scale-95 transition-all cursor-pointer"
              title="Close Sidebar"
              aria-label="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Location badge */}
          <div className="mx-4 mb-3 flex items-center justify-between rounded-xl bg-primary-50 px-3.5 py-2.5 ring-1 ring-primary-100 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="h-4 w-4 shrink-0 text-primary-600" />
              <span className="truncate text-sm font-semibold text-primary-700">{city}</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBack();
              }}
              className="text-[11px] font-bold text-primary-600 hover:text-primary-800 hover:underline shrink-0 ml-1 cursor-pointer transition-colors"
              title="Change Location"
            >
              Change
            </button>
          </div>

          {/* Navigation Title */}
          <div className="px-5 pt-1 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Navigation Tabs
          </div>

          {/* Navigation with full tab names */}
          <nav className="flex flex-1 flex-col gap-1.5 px-3 py-1">
            {navItems.map((t) => {
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    setMobileMenuOpen(false);
                    fetchData();
                  }}
                  className={`flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-150 active:scale-95 cursor-pointer text-left ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <t.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-primary-600'}`} />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate leading-tight">{t.label}</span>
                    <span className={`text-[11px] font-normal truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                      {t.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile link & Location Change - Footer */}
        <div className="shrink-0 border-t border-gray-100 bg-white p-3 space-y-2">
          <UserProfileMenu variant="sidebar" currentCity={city} />
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onBack();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-2.5 px-3 text-xs font-semibold text-gray-700 transition-all duration-150 hover:bg-primary-50 hover:text-primary-700 hover:ring-1 hover:ring-primary-200 active:scale-95 cursor-pointer"
            title="Change your current city/region"
          >
            <MapPin className="h-3.5 w-3.5 text-primary-600 transition-transform duration-150 group-hover:scale-110" />
            Change Location
          </button>
        </div>
      </aside>

      {/* Main content with left padding to offset fixed sidebar on desktop, full width on mobile */}
      <main className="flex-1 min-w-0 pl-0 md:pl-64 overflow-x-hidden pb-20 md:pb-6">
        {/* Mobile Sticky Header (< 768px): Top bar with Menu Button, active tab, and location */}
        <header className="md:hidden sticky top-0 z-30 bg-white/95 border-b border-gray-200/80 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between px-3 py-2.5 gap-2">
            {/* Left: Prominent Menu Button that opens the Side Navigation Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-primary-50 border border-primary-200/70 px-2.5 py-1.5 text-xs font-bold text-primary-800 shadow-xs active:scale-95 transition-all cursor-pointer"
                aria-label="Open Side Navigation Bar"
              >
                <Menu className="h-4 w-4 text-primary-600 shrink-0" />
                <span>Menu</span>
              </button>
              <a href="/index.html" className="flex items-center shrink-0 active:scale-95 transition-transform" title="LifeFlow Portal">
                <img src="/lifeflow-logo.png" alt="Life Flow" className="h-7 w-auto object-contain" />
              </a>
            </div>

            {/* Right: Active Tab indicator + Location + Profile */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={onBack}
                className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200 active:scale-95 transition-all shrink-0"
                title="Change Location"
              >
                <MapPin className="h-3 w-3 text-primary-600 shrink-0" />
                <span className="truncate max-w-[70px]">{city}</span>
              </button>
              <UserProfileMenu variant="header" currentCity={city} />
            </div>
          </div>
        </header>

        {/* Desktop Sticky Header (>= 768px): Original desktop layout */}
        <header className="hidden md:flex sticky top-0 z-20 items-center justify-between border-b border-gray-100 bg-white/90 px-6 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900 capitalize">
              {tab === 'dashboard' ? 'Overview' : tab === 'donors' ? 'Voluntary Donors' : tab === 'requests' ? 'Urgent Requests' : 'Donation Camps'}
            </span>
            <span className="text-xs font-medium text-gray-400">• {city}</span>
          </div>
          <div className="flex items-center gap-3">
            <UserProfileMenu variant="header" currentCity={city} />
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-3.5 py-4 sm:px-6 sm:py-6 md:px-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
                <p className="text-sm text-gray-500">Loading real-time data...</p>
              </div>
            </div>
          ) : (
            <div key={tab} className="animate-tab-enter">
              {tab === 'dashboard' && (
                <Dashboard
                  inventory={inventory}
                  donors={donors}
                  requests={requests}
                  hospitals={hospitals}
                  onSelectHospital={onSelectHospital}
                  onRefresh={fetchData}
                  onNavigateTab={(t) => {
                    setTab(t);
                    fetchData();
                  }}
                />
              )}
              {tab === 'donors' && <DonorsTab donors={donors} city={city} onRefresh={fetchData} />}
              {tab === 'requests' && <RequestsTab requests={requests} city={city} hospitals={hospitals} onRefresh={fetchData} />}
              {tab === 'camps' && <CampsTab camps={camps} />}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Fixed Navigation Bar (< 768px): Thumb-friendly with Tab Names */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-gray-200 bg-white/95 px-1 py-1 shadow-lg backdrop-blur-md md:hidden">
        {navItems.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                fetchData();
              }}
              className={`flex flex-1 flex-col items-center justify-center py-1 px-1 text-[11px] font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
                isActive ? 'text-primary-600 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-primary-50 text-primary-600 scale-105 ring-1 ring-primary-200' : ''}`}>
                <t.icon className="h-4 w-4" />
              </div>
              <span className="mt-0.5 truncate max-w-[64px]">{t.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-1 flex-col items-center justify-center py-1 px-1 text-[11px] font-semibold text-gray-500 hover:text-primary-600 transition-all active:scale-95 cursor-pointer"
        >
          <div className="p-1 rounded-xl text-gray-600">
            <Menu className="h-4 w-4" />
          </div>
          <span className="mt-0.5">Sidebar</span>
        </button>
      </nav>
    </div>
  );
}

/* ============ Dashboard ============ */

function Dashboard({
  inventory,
  donors,
  requests,
  hospitals,
  onSelectHospital,
  onRefresh,
  onNavigateTab,
}: {
  inventory: BloodInventory[];
  donors: Donor[];
  requests: BloodRequest[];
  hospitals: Hospital[];
  onSelectHospital: (h: Hospital) => void;
  onRefresh?: () => void;
  onNavigateTab?: (t: Tab) => void;
}) {
  const openRequests = requests.filter((r) => r.status === 'Open');
  const availableDonors = donors.filter((d) => d.is_available !== false);
  const totalUnits = inventory.reduce((sum, i) => sum + i.units_available, 0);
  const totalNeeded = inventory.reduce((sum, i) => sum + i.units_needed, 0);
  const manualDonorsCount = donors.filter((d) => isManualDonor(d.id)).length;
  const manualRequestsCount = openRequests.filter((r) => isManualRequest(r.id)).length;

  // Aggregate by blood group (normalized per hospital facility across regional network)
  const hospCount = Math.max(hospitals.length, 1);
  const byGroup = BLOOD_GROUPS.map((group) => {
    const items = inventory.filter((i) => i.blood_group === group);
    const totalAvailable = items.reduce((s, i) => s + i.units_available, 0);
    const totalNeeded = items.reduce((s, i) => s + i.units_needed, 0);
    const available = Math.round(totalAvailable / hospCount);
    const needed = Math.round(totalNeeded / hospCount);
    return { group, available, needed, totalAvailable, totalNeeded };
  });

  const maxUnits = Math.max(...byGroup.map((g) => g.available + g.needed), 1);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Droplet} label="Total Units Available" value={totalUnits} color="primary" trend="up" />
        <StatCard icon={AlertCircle} label="Units Needed" value={totalNeeded} color="warning" trend="down" />
        <StatCard
          icon={Users}
          label={manualDonorsCount > 0 ? `Available Donors (+${manualDonorsCount} demo)` : 'Available Donors'}
          value={availableDonors.length}
          color="success"
          trend="up"
          onClick={onNavigateTab ? () => onNavigateTab('donors') : undefined}
          title="Click to view all registered donors"
        />
        <StatCard
          icon={Heart}
          label={manualRequestsCount > 0 ? `Open Requests (+${manualRequestsCount} demo)` : 'Open Requests'}
          value={openRequests.length}
          color="error"
          trend="down"
          onClick={onNavigateTab ? () => onNavigateTab('requests') : undefined}
          title="Click to view urgent blood requests"
        />
      </div>

      {/* Blood group chart */}
      <div className="card p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Blood Group Availability</h3>
            <p className="text-sm text-gray-500">Real-time inventory status per facility across network</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-xs" /> &lt; 100 Units (Critical)
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-xs" /> 100 – 150 Units (Moderate)
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs" /> &gt; 150 Units (Optimal)
            </span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
          {byGroup.map((g) => {
            const isRed = g.available < 100;
            const isYellow = g.available >= 100 && g.available <= 150;
            const barGradient = isRed
              ? 'from-red-600 to-rose-400'
              : isYellow
                ? 'from-amber-500 to-yellow-400'
                : 'from-emerald-600 to-green-400';
            const labelColor = isRed
              ? 'text-red-600'
              : isYellow
                ? 'text-amber-600'
                : 'text-emerald-600';
            const shadowColor = isRed
              ? 'shadow-red-500/25'
              : isYellow
                ? 'shadow-amber-500/25'
                : 'shadow-emerald-500/25';
            const statusText = isRed
              ? 'Critical (<100 units)'
              : isYellow
                ? 'Moderate (100-150 units)'
                : 'Optimal (>150 units)';

            return (
              <div key={g.group} className="group flex flex-col items-center">
                <div className="relative flex h-40 w-full items-end justify-center">
                  <div className="flex w-full max-w-[42px] flex-col-reverse gap-px overflow-hidden rounded-t-xl transition-all duration-300 group-hover:scale-105">
                    <div
                      className={`w-full bg-gradient-to-t ${barGradient} shadow-md ${shadowColor} transition-all duration-500 rounded-t-md`}
                      style={{ height: `${Math.max(14, (g.available / maxUnits) * 140)}px` }}
                      title={`${g.group}: ${g.available} units available per facility (${g.totalAvailable} total in network) • ${statusText}`}
                    />
                    {g.needed > 0 && (
                      <div
                        className="w-full bg-gray-400/40 border-b border-white/50 transition-all duration-500"
                        style={{ height: `${Math.max(4, (g.needed / maxUnits) * 35)}px` }}
                        title={`${g.needed} units needed`}
                      />
                    )}
                  </div>
                </div>
                <span className="mt-2 text-sm font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors">{g.group}</span>
                <span className={`text-xs font-bold ${labelColor}`}>{g.available} units</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two column: urgent requests + hospitals */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Urgent requests */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Urgent Blood Requests</h3>
            <div className="flex items-center gap-2">
              {openRequests.some((r) => isManualRequest(r.id)) && (
                <button
                  type="button"
                  onClick={() => {
                    clearAllManualRequests();
                    onRefresh?.();
                  }}
                  className="text-[11px] font-bold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 cursor-pointer bg-red-50 px-2 py-0.5 rounded-lg border border-red-200"
                  title="Clean up all manual demo requests"
                >
                  <X className="h-3 w-3" /> Clean Demos
                </button>
              )}
              <span className="badge bg-error-50 text-error-600 font-semibold ring-1 ring-error-100">{openRequests.length} open</span>
            </div>
          </div>
          <div className="space-y-3">
            {openRequests.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No open requests right now.</p>
            ) : (
              openRequests.slice(0, 5).map((r) => {
                const isManual = isManualRequest(r.id);
                return (
                  <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-gray-50/80 p-3.5 transition-all duration-200 hover:bg-white hover:shadow-md hover:-translate-y-0.5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold shadow-xs transition-transform duration-200 hover:scale-105 ${
                        r.urgency === 'Critical'
                          ? 'bg-error-100 text-error-700'
                          : r.urgency === 'Urgent'
                            ? 'bg-warning-100 text-warning-700'
                            : 'bg-primary-100 text-primary-700'
                      }`}
                    >
                      {r.blood_group}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900">{r.patient_name}</p>
                        {isManual && (
                          <span className="badge bg-amber-50 text-amber-700 font-medium ring-1 ring-amber-200 text-[10px] py-0 px-1.5">Demo</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {r.units_needed} units needed · <span className="font-medium text-gray-700">{r.urgency}</span>
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {timeAgo(r.created_at)}
                    </span>
                    {isManual && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOfflineRequest(r.id);
                          onRefresh?.();
                        }}
                        className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove manual demo request"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Hospitals */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hospital Blood Metrics</h3>
              <p className="text-xs text-gray-500">Click any hospital to inspect detailed blood metrics</p>
            </div>
            <span className="badge bg-primary-50 text-primary-600 font-semibold ring-1 ring-primary-100">{hospitals.length} hospitals</span>
          </div>
          <div className="space-y-3">
            {hospitals.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No hospitals registered yet.</p>
            ) : (
              hospitals.map((h) => {
                const hospInv = inventory.filter((i) => i.hospital_id === h.id);
                const hospUnits = hospInv.reduce((s, i) => s + i.units_available, 0);
                return (
                  <button
                    key={h.id}
                    onClick={() => onSelectHospital(h)}
                    className="group flex w-full items-center gap-3.5 rounded-2xl bg-gray-50/80 p-3.5 text-left transition-all duration-200 hover:bg-white hover:shadow-lg hover:shadow-primary-950/5 hover:-translate-y-1 hover:ring-1 hover:ring-primary-200 active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-all duration-200 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-primary-600/30">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors duration-200">{h.name}</p>
                      <p className="truncate text-xs text-gray-500">{h.address}, {h.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-success-600 group-hover:scale-105 transition-transform duration-200">{hospUnits}</p>
                      <p className="text-[11px] text-gray-400">units available</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
  onClick,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: 'primary' | 'success' | 'warning' | 'error';
  trend: 'up' | 'down';
  onClick?: () => void;
  title?: string;
}) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    error: 'bg-error-50 text-error-600',
  };
  return (
    <div
      onClick={onClick}
      title={title}
      className={`card p-4 md:p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${
        onClick ? 'cursor-pointer hover:ring-1 hover:ring-primary-200' : 'cursor-default'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClasses[color]} transition-transform duration-200 hover:scale-110`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-success-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-error-500" />
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

/* ============ Donors Tab ============ */

function DonorsTab({ donors, city, onRefresh }: { donors: Donor[]; city: string; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState<BloodGroup | 'all'>('all');

  const filtered = donors.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.blood_group.toLowerCase().includes(search.toLowerCase());
    const matchGroup = filterGroup === 'all' || d.blood_group === filterGroup;
    return matchSearch && matchGroup;
  });

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Registered Donors</h2>
          <p className="text-sm text-gray-500">{donors.length} donors in {city}</p>
        </div>
        <div className="flex items-center gap-2">
          {donors.some((d) => isManualDonor(d.id)) && (
            <button
              onClick={() => {
                clearAllManualDonors();
                onRefresh();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
              title="Clean up all manual demo donors"
            >
              <X className="h-3.5 w-3.5" /> Clean Demo Donors
            </button>
          )}
          <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-2.5 text-sm font-bold shadow-md shrink-0 cursor-pointer">
            <Plus className="h-4 w-4 shrink-0" />
            Register as Donor
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or blood group..."
            className="input pl-10"
          />
        </div>
        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value as BloodGroup | 'all')}
          className="input w-auto min-w-[140px]"
        >
          <option value="all">All Groups</option>
          {BLOOD_GROUPS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Donor list */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-400">No donors found. Be the first to register!</p>
          </div>
        ) : (
          filtered.map((d) => {
            const isManual = isManualDonor(d.id);
            return (
              <div key={d.id} className="card p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg relative">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-sm font-bold text-primary-700 transition-transform duration-200 hover:scale-105">
                    {d.blood_group}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-gray-900">{d.name}</p>
                      {d.is_available ? (
                        <span className="badge bg-success-50 text-success-700 font-semibold ring-1 ring-success-200">Available</span>
                      ) : (
                        <span className="badge bg-gray-100 text-gray-500 font-medium">Unavailable</span>
                      )}
                      {isManual && (
                        <span className="badge bg-amber-50 text-amber-700 text-[10px] font-semibold ring-1 ring-amber-200 py-0 px-1.5">Demo</span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" /> {d.city}
                    </div>
                    {d.last_donated && (
                      <p className="mt-1 text-xs text-gray-400">Last donated: {d.last_donated}</p>
                    )}
                  </div>
                  {isManual && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteOfflineDonor(d.id);
                        onRefresh();
                      }}
                      className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors active:scale-90 cursor-pointer"
                      title="Remove manual demo donor"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-gray-50 pt-3">
                  <a href={`tel:${d.phone}`} className="btn-ghost flex-1 text-xs transition-all duration-150 active:scale-95 cursor-pointer">
                    <Phone className="h-3.5 w-3.5" /> Call Donor
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showForm && (
        <DonorFormModal city={city} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); onRefresh(); }} />
      )}
    </div>
  );
}

function DonorFormModal({ city, onClose, onSaved }: { city: string; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: '',
    blood_group: 'O+' as BloodGroup,
    phone: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    const phoneErr = validateIndianPhoneNumber(form.phone);
    if (phoneErr) {
      setError(phoneErr);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      addOfflineDonor({
        name: form.name.trim(),
        blood_group: form.blood_group,
        city,
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        is_available: true,
      });
      setSaving(false);
      onSaved();
    } catch {
      setSaving(false);
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <Modal onClose={onClose} title="Register as Donor">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-lg bg-error-50 px-4 py-2 text-sm text-error-600">{error}</div>}
        <div>
          <label className="label">Full Name *</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
        </div>
        <div>
          <label className="label">Blood Group *</label>
          <select className="input" value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value as BloodGroup })}>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Phone Number *</label>
          <div className="relative flex rounded-xl border border-gray-200 bg-white shadow-xs focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100 transition-all duration-200 overflow-hidden">
            <span className="inline-flex items-center px-3.5 bg-gray-50 text-gray-700 text-sm font-semibold border-r border-gray-200 select-none">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              className="w-full px-4 py-3 text-sm text-gray-900 bg-transparent placeholder-gray-400 focus:outline-none font-mono tracking-wider"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: cleanIndianPhoneInput(e.target.value) })}
              placeholder="9876543210"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">10-digit mobile number (e.g. 9876543210)</p>
        </div>
        <div>
          <label className="label">Email (optional)</label>
          <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ============ Requests Tab ============ */

function RequestsTab({
  requests,
  city,
  hospitals,
  onRefresh,
}: {
  requests: BloodRequest[];
  city: string;
  hospitals: Hospital[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);

  const sorted = [...requests].sort((a, b) => {
    const urgencyOrder = { Critical: 0, Urgent: 1, Normal: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blood Requests</h2>
          <p className="text-sm text-gray-500">{requests.filter((r) => r.status === 'Open').length} open requests</p>
        </div>
        <div className="flex items-center gap-2">
          {requests.some((r) => isManualRequest(r.id)) && (
            <button
              type="button"
              onClick={() => {
                clearAllManualRequests();
                onRefresh();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
              title="Clean up all manual demo blood requests"
            >
              <X className="h-3.5 w-3.5" /> Clean Demo Requests
            </button>
          )}
          <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-2.5 text-sm font-bold shadow-md shrink-0 cursor-pointer">
            <Plus className="h-4 w-4 shrink-0" />
            Request Blood
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-400">No blood requests at this time.</p>
          </div>
        ) : (
          sorted.map((r) => {
            const hospital = hospitals.find((h) => h.id === r.hospital_id);
            const isManual = isManualRequest(r.id);
            return (
              <div key={r.id} className="card p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg relative">
                <div className="flex flex-wrap items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-base font-bold shadow-xs transition-transform duration-200 hover:scale-105 ${
                      r.urgency === 'Critical'
                        ? 'bg-error-100 text-error-700'
                        : r.urgency === 'Urgent'
                          ? 'bg-warning-100 text-warning-700'
                          : 'bg-primary-100 text-primary-700'
                    }`}
                  >
                    {r.blood_group}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{r.patient_name}</p>
                      <span
                        className={`badge ${
                          r.urgency === 'Critical'
                            ? 'bg-error-50 text-error-700 ring-1 ring-error-200 font-semibold'
                            : r.urgency === 'Urgent'
                              ? 'bg-warning-50 text-warning-700 ring-1 ring-warning-200 font-semibold'
                              : 'bg-primary-50 text-primary-700 ring-1 ring-primary-200 font-semibold'
                        }`}
                      >
                        {r.urgency}
                      </span>
                      <span
                        className={`badge ${
                          r.status === 'Open'
                            ? 'bg-success-50 text-success-700 ring-1 ring-success-200 font-semibold'
                            : r.status === 'Fulfilled'
                              ? 'bg-gray-100 text-gray-500'
                              : 'bg-error-50 text-error-600'
                        }`}
                      >
                        {r.status}
                      </span>
                      {isManual && (
                        <span className="badge bg-amber-50 text-amber-700 text-[10px] font-semibold ring-1 ring-amber-200 py-0 px-1.5">Demo</span>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Droplet className="h-3 w-3 text-primary-600" /> {r.units_needed} units needed
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" /> {r.city}
                      </span>
                      {hospital && (
                        <span className="flex items-center gap-1 text-primary-700 font-medium">
                          <Building2 className="h-3 w-3" /> {hospital.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" /> {timeAgo(r.created_at)}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Requested by {r.requester_name} · {r.requester_phone}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {hospital && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${hospital.name}, ${hospital.address || ''}, ${hospital.city}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost text-xs transition-all duration-150 active:scale-95 cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1"
                        title={`Get Directions to ${hospital.name}`}
                      >
                        <Navigation className="h-3.5 w-3.5" /> Directions
                      </a>
                    )}
                    {r.status === 'Open' && (
                      <a href={`tel:${r.requester_phone}`} className="btn-secondary text-xs transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> Contact
                      </a>
                    )}
                    {isManual && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOfflineRequest(r.id);
                          onRefresh();
                        }}
                        className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all active:scale-90 cursor-pointer flex items-center gap-1 text-xs font-semibold"
                        title="Remove manual demo request"
                      >
                        <X className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete Demo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showForm && (
        <RequestFormModal
          city={city}
          hospitals={hospitals}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); onRefresh(); }}
        />
      )}
    </div>
  );
}

function RequestFormModal({
  city,
  hospitals,
  onClose,
  onSaved,
}: {
  city: string;
  hospitals: Hospital[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    patient_name: '',
    blood_group: 'O+' as BloodGroup,
    units_needed: 1,
    requester_name: '',
    requester_phone: '',
    urgency: 'Normal' as 'Critical' | 'Urgent' | 'Normal',
    hospital_id: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient_name.trim() || !form.requester_name.trim()) {
      setError('Patient name and requester name are required.');
      return;
    }
    const phoneErr = validateIndianPhoneNumber(form.requester_phone);
    if (phoneErr) {
      setError(phoneErr);
      return;
    }
    if (form.units_needed < 1 || form.units_needed > 5) {
      setError('Units needed must be between 1 and 5 units.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      addOfflineRequest({
        patient_name: form.patient_name.trim(),
        blood_group: form.blood_group,
        units_needed: Math.min(5, Math.max(1, form.units_needed)),
        city,
        requester_name: form.requester_name.trim(),
        requester_phone: form.requester_phone.trim(),
        urgency: form.urgency,
        hospital_id: form.hospital_id || null,
      });
      setSaving(false);
      onSaved();
    } catch {
      setSaving(false);
      setError('Failed to create request. Please try again.');
    }
  };

  return (
    <Modal onClose={onClose} title="Request Blood">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-lg bg-error-50 px-4 py-2 text-sm text-error-600">{error}</div>}
        <div>
          <label className="label">Patient Name *</label>
          <input className="input" value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} placeholder="Patient name" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Blood Group *</label>
            <select className="input" value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value as BloodGroup })}>
              {BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Units Needed (Max 5) *</label>
            <input
              type="number"
              min={1}
              max={5}
              className="input"
              value={form.units_needed}
              onChange={(e) => {
                const parsed = parseInt(e.target.value);
                if (isNaN(parsed)) {
                  setForm({ ...form, units_needed: 1 });
                } else {
                  setForm({ ...form, units_needed: Math.min(5, Math.max(1, parsed)) });
                }
              }}
            />
            <p className="mt-1 text-xs text-gray-500">Maximum 5 units per request</p>
          </div>
        </div>
        <div>
          <label className="label">Urgency *</label>
          <div className="grid grid-cols-3 gap-2">
            {(['Critical', 'Urgent', 'Normal'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setForm({ ...form, urgency: u })}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  form.urgency === u
                    ? u === 'Critical'
                      ? 'bg-error-600 text-white'
                      : u === 'Urgent'
                        ? 'bg-warning-500 text-white'
                        : 'bg-primary-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Hospital (optional)</label>
          <select className="input" value={form.hospital_id} onChange={(e) => setForm({ ...form, hospital_id: e.target.value })}>
            <option value="">No specific hospital</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Your Name *</label>
          <input className="input" value={form.requester_name} onChange={(e) => setForm({ ...form, requester_name: e.target.value })} placeholder="Your full name" />
        </div>
        <div>
          <label className="label">Your Phone *</label>
          <div className="relative flex rounded-xl border border-gray-200 bg-white shadow-xs focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100 transition-all duration-200 overflow-hidden">
            <span className="inline-flex items-center px-3.5 bg-gray-50 text-gray-700 text-sm font-semibold border-r border-gray-200 select-none">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              className="w-full px-4 py-3 text-sm text-gray-900 bg-transparent placeholder-gray-400 focus:outline-none font-mono tracking-wider"
              value={form.requester_phone}
              onChange={(e) => setForm({ ...form, requester_phone: cleanIndianPhoneInput(e.target.value) })}
              placeholder="9876543210"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">10-digit mobile number (e.g. 9876543210)</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ============ Camps Tab ============ */

function ContactCampModal({
  camp,
  onClose,
}: {
  camp: BloodCamp & { hospital?: Hospital };
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [message, setMessage] = useState('Hi, I am interested in donating blood at this camp.');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const campPhone = camp.hospital?.phone || '+91 1800 180 1104';
  const cleanPhone = campPhone.replace(/[^+\d]/g, '');
  const organizerText = camp.organizer || (camp.hospital ? `${camp.hospital.name} Blood Bank` : 'Camp Organizing Team');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneErr = validateIndianPhoneNumber(phone);
    if (phoneErr) {
      setFormError(phoneErr);
      return;
    }
    setFormError(null);
    setSubmitted(true);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone.replace('+', '')}&text=${encodeURIComponent(
    `Hello! I want to inquire about the blood donation camp: ${camp.name} on ${camp.date} at ${camp.address}, ${camp.city}.`
  )}`;

  return (
    <Modal onClose={onClose} title="Contact Donation Camp">
      <div className="space-y-4 text-left">
        {/* Camp Header Details */}
        <div className="rounded-2xl bg-primary-50 p-4 ring-1 ring-primary-100">
          <h4 className="font-bold text-gray-900 leading-snug">{camp.name}</h4>
          <div className="mt-2 space-y-1 text-xs text-gray-600">
            <p className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary-600 shrink-0" />
              <span>
                {new Date(camp.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {camp.start_time} - {camp.end_time}
              </span>
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary-600 shrink-0" />
              <span>{camp.address}, {camp.city}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary-600 shrink-0" />
              <span>Organized by: <strong className="text-gray-800">{organizerText}</strong></span>
            </p>
          </div>
        </div>

        {/* Quick Contact Action Buttons */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Direct Contact Channels</label>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={`tel:${cleanPhone}`}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-gray-50 p-2.5 text-center ring-1 ring-gray-200 transition-all duration-150 hover:bg-primary-50 hover:ring-primary-200 hover:text-primary-700 active:scale-95"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-xs">
                <Phone className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-gray-900 mt-1">Call</span>
              <span className="text-[10px] text-gray-500 font-mono truncate max-w-full">{campPhone}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-gray-50 p-2.5 text-center ring-1 ring-gray-200 transition-all duration-150 hover:bg-emerald-50 hover:ring-emerald-200 hover:text-emerald-700 active:scale-95"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <MessageSquare className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-gray-900 mt-1">WhatsApp</span>
              <span className="text-[10px] text-gray-500 truncate max-w-full">Chat Now</span>
            </a>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${camp.name}, ${camp.address}, ${camp.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-gray-50 p-2.5 text-center ring-1 ring-gray-200 transition-all duration-150 hover:bg-blue-50 hover:ring-blue-200 hover:text-blue-700 active:scale-95"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Navigation className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-gray-900 mt-1">Directions</span>
              <span className="text-[10px] text-gray-500 truncate max-w-full">Google Maps</span>
            </a>
          </div>
        </div>

        {/* In-App Inquiry Form */}
        <div className="border-t border-gray-100 pt-3">
          {submitted ? (
            <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200 text-center space-y-2 animate-scale-in">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h5 className="text-sm font-bold text-emerald-900">Inquiry Received!</h5>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Thank you, <strong>{name || 'Donor'}</strong>. Your message and contact details have been sent to the camp coordination team. They will reach out to you shortly before the camp date.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-all duration-150 hover:bg-emerald-700 active:scale-95 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Send Message / Register to Donate</label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Sahoo"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number *</label>
                  <div className="flex rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:border-primary-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-primary-500 transition-colors">
                    <span className="inline-flex items-center px-2.5 text-gray-600 text-xs font-bold border-r border-gray-200 select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      required
                      value={phone}
                      onChange={(e) => {
                        setFormError(null);
                        setPhone(cleanIndianPhoneInput(e.target.value));
                      }}
                      placeholder="9876543210"
                      className="w-full px-2.5 py-2 text-xs text-gray-900 border-0 focus:outline-none focus:ring-0 bg-transparent font-mono tracking-wider"
                    />
                  </div>
                  {formError && <p className="text-[11px] text-red-600 mt-1 font-medium">{formError}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Blood Group (Optional)</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none"
                >
                  <option value="">Select your blood group (optional)</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Question or Notes</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Can I walk in without an appointment? Or any special preparation required?"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all duration-150 hover:bg-primary-700 hover:shadow-sm active:scale-95 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Inquiry to Camp
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}

function CampsTab({ camps }: { camps: (BloodCamp & { hospital?: Hospital })[] }) {
  const [contactCamp, setContactCamp] = useState<(BloodCamp & { hospital?: Hospital }) | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = camps.filter((c) => {
    if (!c.date) return false;
    return new Date(c.date) >= today;
  });

  const displayCamps = upcoming.length > 0 ? upcoming : camps;

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blood Donation Camps</h2>
          <p className="text-sm text-gray-500">{displayCamps.length} camps scheduled in your area</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayCamps.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-400">No donation camps scheduled at this time.</p>
          </div>
        ) : (
          displayCamps.map((c) => {
            const campPhone = c.hospital?.phone || '+91 1800 180 1104';
            const cleanPhone = campPhone.replace(/[^+\d]/g, '');

            return (
              <div key={c.id} className="card overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-5">
                    <div className="flex items-center justify-between text-white">
                      <Calendar className="h-5 w-5" />
                      <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                        {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-white leading-snug">{c.name}</h3>
                  </div>
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <span>{c.address}, {c.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                      <span>{c.start_time} – {c.end_time}</span>
                    </div>
                    {c.hospital && (
                      <div className="flex items-center gap-2 text-xs font-medium text-primary-700 bg-primary-50 px-2.5 py-1.5 rounded-lg ring-1 ring-primary-100">
                        <Building2 className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">Partner: {c.hospital.name}</span>
                      </div>
                    )}
                    {c.organizer && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-1 border-t border-gray-100">
                        <Users className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        <span>Organized by: <strong className="text-gray-700">{c.organizer}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Option to Contact Camp */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => setContactCamp(c)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-primary-700 hover:shadow-md active:scale-95 cursor-pointer"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      Contact Camp
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${c.name}, ${c.address}, ${c.city}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 transition-all duration-150 hover:bg-blue-100 hover:ring-blue-300 active:scale-95 cursor-pointer"
                      title="Get Directions on Google Maps"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Get Directions
                    </a>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 transition-all duration-150 hover:bg-primary-100 hover:ring-primary-200 active:scale-95 cursor-pointer"
                      title={`Call ${campPhone}`}
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Contact Camp Modal */}
      {contactCamp && (
        <ContactCampModal camp={contactCamp} onClose={() => setContactCamp(null)} />
      )}
    </div>
  );
}

/* ============ Shared ============ */

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-xs transition-opacity duration-200" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 transition-all duration-150 hover:bg-gray-100 hover:text-gray-700 hover:rotate-90 active:scale-90 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
