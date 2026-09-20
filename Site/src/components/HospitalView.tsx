import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ArrowLeft, Droplet, Building2, AlertCircle, Clock, Phone, MapPin,
  Activity, Calendar, Search, User, ShieldCheck, CheckCircle2,
  PhoneCall, MessageSquare, Send, X, Navigation,
} from 'lucide-react';
import {
  BLOOD_GROUPS,
  BLOOD_COMPONENTS,
  type BloodGroup,
  type BloodComponent,
  type BloodInventory,
  type BloodCamp,
  type Hospital,
} from '@/lib/supabase';
import {
  getOfflineInventory,
  getOfflineCamps,
  cleanIndianPhoneInput,
  validateIndianPhoneNumber,
} from '@/lib/offlineData';
import { UserProfileMenu } from '@/components/UserProfileMenu';

interface HospitalViewProps {
  hospital: Hospital;
  city: string;
  onBack: () => void;
}

type Tab = 'metrics' | 'camps';

export function HospitalView({ hospital, city, onBack }: HospitalViewProps) {
  const [tab, setTab] = useState<Tab>('metrics');
  const [inventory, setInventory] = useState<BloodInventory[]>([]);
  const [camps, setCamps] = useState<BloodCamp[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    const inv = getOfflineInventory([hospital.id]);
    const hospCamps = getOfflineCamps(undefined, hospital.id);
    setInventory(inv);
    setCamps(hospCamps);
    setLoading(false);
  }, [hospital.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-[#fdf6f3]">
      {/* Left Sidebar - Locked at viewport */}
      <aside className="fixed top-0 left-0 bottom-0 z-30 flex h-screen w-64 flex-col justify-between border-r border-gray-100 bg-white shadow-xs">
        {/* Top Scrollable Navigation Section */}
        <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 py-5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 shadow-sm">
              <Droplet className="h-5 w-5 text-white" fill="white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 leading-none block">LifeFlow</span>
              <span className="text-[10px] text-gray-400 font-medium">Hospital Blood Metrics</span>
            </div>
          </div>

          {/* Hospital badge */}
          <div className="mx-4 mb-3 rounded-2xl bg-primary-50 p-3.5 ring-1 ring-primary-100 shrink-0">
            <div className="flex items-center gap-2 text-primary-700">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate text-sm font-bold">{hospital.name}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500 truncate flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" /> {hospital.address}, {hospital.city}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {hospital.phone && (
                <a
                  href={`tel:${hospital.phone}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
                >
                  <Phone className="h-3 w-3" /> {hospital.phone}
                </a>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${hospital.name}, ${hospital.address}, ${hospital.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-700 hover:text-primary-800 bg-primary-100/70 px-2 py-0.5 rounded-md ml-auto"
                title={`Directions to ${hospital.name}`}
              >
                <Navigation className="h-3 w-3" /> Directions
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
            {[
              { id: 'metrics' as Tab, label: 'Blood Metrics', icon: Activity },
              { id: 'camps' as Tab, label: 'Donation Camps', icon: Calendar },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 active:scale-95 cursor-pointer ${
                  tab === t.id
                    ? 'bg-primary-50 text-primary-700 font-semibold ring-1 ring-primary-100 shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <t.icon className="h-4 w-4 shrink-0" />
                {t.label}
                {t.id === 'camps' && camps.length > 0 && (
                  <span className="ml-auto rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
                    {camps.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile link & Return button - Always pinned at the very bottom */}
        <div className="shrink-0 border-t border-gray-100 bg-white p-3 space-y-2">
          <UserProfileMenu variant="sidebar" currentCity={city} />
          <button
            onClick={onBack}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 transition-all duration-150 hover:bg-gray-200 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
            Back to {city || 'Dashboard'}
          </button>
        </div>
      </aside>

      {/* Main content with left padding to offset fixed sidebar */}
      <main className="flex-1 min-w-0 pl-64 overflow-x-hidden">
        {/* Sticky topbar with signed-in user profile option */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white/80 px-6 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-gray-900 truncate max-w-[280px] md:max-w-md">
              {hospital.name}
            </span>
            <span className="text-xs font-medium text-gray-400">• {city}</span>
          </div>
          <div className="flex items-center gap-3">
            <UserProfileMenu variant="header" currentCity={city} />
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
                <p className="text-sm text-gray-500">Loading blood metrics for {hospital.name}...</p>
              </div>
            </div>
          ) : (
            <div key={tab} className="animate-tab-enter">
              {tab === 'metrics' && <MetricsTab hospital={hospital} inventory={inventory} />}
              {tab === 'camps' && <CampsTab camps={camps} hospital={hospital} />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* =========================================================================
   BLOOD METRICS TAB (Pure Read-Only Analytics & Inventory Stock Levels)
   ========================================================================= */

function MetricsTab({ hospital, inventory }: { hospital: Hospital; inventory: BloodInventory[] }) {
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState<BloodGroup | 'all'>('all');
  const [filterComponent, setFilterComponent] = useState<BloodComponent | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');

  // Aggregated totals
  const totalAvailable = useMemo(() => inventory.reduce((s, i) => s + i.units_available, 0), [inventory]);
  const totalNeeded = useMemo(() => inventory.reduce((s, i) => s + i.units_needed, 0), [inventory]);
  
  // Blood groups status overview
  const groupStats = useMemo(() => {
    return BLOOD_GROUPS.map((group) => {
      const items = inventory.filter((i) => i.blood_group === group);
      const available = items.reduce((s, i) => s + i.units_available, 0);
      const needed = items.reduce((s, i) => s + i.units_needed, 0);
      return { group, available, needed };
    });
  }, [inventory]);

  const outOfStockGroups = useMemo(() => {
    return groupStats.filter((g) => g.available < 100).length;
  }, [groupStats]);

  const inStockGroups = useMemo(() => {
    return groupStats.filter((g) => g.available > 150).length;
  }, [groupStats]);

  // Filtered inventory items for the table
  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const matchSearch =
        item.blood_group.toLowerCase().includes(search.toLowerCase()) ||
        item.component.toLowerCase().includes(search.toLowerCase());
      const matchGroup = filterGroup === 'all' || item.blood_group === filterGroup;
      const matchComponent = filterComponent === 'all' || item.component === filterComponent;
      
      let matchStatus = true;
      if (filterStatus === 'out-of-stock') matchStatus = item.units_available < 100;
      else if (filterStatus === 'low-stock') matchStatus = item.units_available >= 100 && item.units_available <= 150;
      else if (filterStatus === 'in-stock') matchStatus = item.units_available > 150;

      return matchSearch && matchGroup && matchComponent && matchStatus;
    });
  }, [inventory, search, filterGroup, filterComponent, filterStatus]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hospital Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700 ring-1 ring-success-200">
              <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
              Live Blood Metrics
            </span>
            <span className="text-xs text-gray-400">• {hospital.city}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{hospital.name}</h1>
          <p className="mt-1 text-sm text-gray-500 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            {hospital.address}, {hospital.city}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {hospital.phone && (
            <a
              href={`tel:${hospital.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all duration-200 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
            >
              <Phone className="h-4 w-4" />
              Call Blood Bank ({hospital.phone})
            </a>
          )}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${hospital.name}, ${hospital.address}, ${hospital.city}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
          >
            <Navigation className="h-4 w-4 text-blue-600" />
            Get Directions
          </a>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="card p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg cursor-default">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 transition-transform duration-200 hover:scale-110">
            <Droplet className="h-5 w-5 text-primary-600" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-gray-900">{totalAvailable}</p>
          <p className="text-xs font-medium text-gray-500">Total Units Available</p>
        </div>
        <div className="card p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg cursor-default">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 transition-transform duration-200 hover:scale-110">
            <AlertCircle className="h-5 w-5 text-warning-600" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-gray-900">{totalNeeded}</p>
          <p className="text-xs font-medium text-gray-500">Total Units Needed</p>
        </div>
        <div className="card p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg cursor-default">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 transition-transform duration-200 hover:scale-110">
            <CheckCircle2 className="h-5 w-5 text-success-600" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-gray-900">{inStockGroups} / 8</p>
          <p className="text-xs font-medium text-gray-500">Optimal Stock Groups (&gt; 150 Units)</p>
        </div>
        <div className="card p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg cursor-default">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error-50 transition-transform duration-200 hover:scale-110">
            <ShieldCheck className="h-5 w-5 text-error-600" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-gray-900">{outOfStockGroups}</p>
          <p className="text-xs font-medium text-gray-500">Critical Shortage Groups (&lt; 100 Units)</p>
        </div>
      </div>

      {/* Blood Group Availability At a Glance */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Blood Group Stock Overview</h2>
            <p className="text-xs text-gray-500">Click a blood group to quickly filter the table below</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-success-500" /> &gt; 150 Units (Green)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-warning-500" /> 100–150 Units (Yellow)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-error-500" /> &lt; 100 Units (Red)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {groupStats.map((g) => {
            const isRed = g.available < 100;
            const isYellow = g.available >= 100 && g.available <= 150;

            const statusColor = isRed
              ? 'border-error-300 bg-error-50/50'
              : isYellow
              ? 'border-warning-300 bg-warning-50/50'
              : 'border-success-300 bg-success-50/50';
            const badgeColor = isRed
              ? 'bg-error-100 text-error-700'
              : isYellow
              ? 'bg-warning-100 text-warning-800'
              : 'bg-success-100 text-success-700';
            const numberColor = isRed
              ? 'text-error-600'
              : isYellow
              ? 'text-warning-600'
              : 'text-success-600';

            const isSelected = filterGroup === g.group;

            return (
              <button
                key={g.group}
                type="button"
                onClick={() => setFilterGroup(filterGroup === g.group ? 'all' : g.group)}
                className={`flex flex-col items-center rounded-2xl border p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95 cursor-pointer ${statusColor} ${
                  isSelected ? 'ring-2 ring-primary-600 shadow-md -translate-y-0.5' : ''
                }`}
                title={`Click to filter by ${g.group}`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs text-sm font-extrabold text-gray-900 transition-transform duration-200 hover:scale-105">
                  {g.group}
                </span>
                <p className={`mt-2 text-lg font-bold ${numberColor}`}>{g.available}</p>
                <span className="text-[10px] text-gray-500">units available</span>
                {g.needed > 0 && (
                  <span className="mt-1 text-[10px] font-semibold text-warning-700">
                    {g.needed} needed
                  </span>
                )}
                <span className={`mt-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeColor}`}>
                  {isRed ? 'Critical' : isYellow ? 'Moderate' : 'Optimal'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Blood Inventory Metrics Table */}
      <div className="card overflow-hidden">
        {/* Table Header & Filters */}
        <div className="border-b border-gray-100 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Detailed Component Metrics</h2>
              <p className="text-xs text-gray-500">
                Displaying real-time blood stock across Whole Blood, Plasma, Platelets, and RBC
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400">
                Showing <strong className="text-gray-700">{filtered.length}</strong> items
              </span>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blood group or component..."
                className="input pl-10 text-sm"
              />
            </div>

            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value as BloodGroup | 'all')}
              className="input w-auto min-w-[130px] text-sm"
            >
              <option value="all">All Groups</option>
              {BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={filterComponent}
              onChange={(e) => setFilterComponent(e.target.value as BloodComponent | 'all')}
              className="input w-auto min-w-[140px] text-sm"
            >
              <option value="all">All Components</option>
              {BLOOD_COMPONENTS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="input w-auto min-w-[130px] text-sm"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Read-Only Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3.5">Blood Group</th>
                <th className="px-5 py-3.5">Component</th>
                <th className="px-5 py-3.5">Units Available</th>
                <th className="px-5 py-3.5">Units Needed</th>
                <th className="px-5 py-3.5">Stock Level</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-sm text-gray-400">
                    No blood metric entries match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isRed = item.units_available < 100;
                  const isYellow = item.units_available >= 100 && item.units_available <= 150;

                  const status = isRed
                    ? { label: 'Critical (<100)', class: 'bg-error-50 text-error-700 ring-1 ring-error-200' }
                    : isYellow
                    ? { label: 'Moderate (100–150)', class: 'bg-warning-50 text-warning-800 ring-1 ring-warning-200' }
                    : { label: 'In Stock (>150)', class: 'bg-success-50 text-success-700 ring-1 ring-success-200' };

                  // Stock bar calculation (max display 200 units)
                  const barWidth = Math.min(100, Math.round((item.units_available / 200) * 100));
                  const barColor = isRed
                    ? 'bg-error-500'
                    : isYellow
                    ? 'bg-warning-500'
                    : 'bg-success-500';
                  const textColor = isRed
                    ? 'text-error-600'
                    : isYellow
                    ? 'text-warning-600'
                    : 'text-success-600';

                  return (
                    <tr key={item.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-5 py-3.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-sm font-bold text-primary-700 shadow-xs">
                          {item.blood_group}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-gray-900">{item.component}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-bold ${textColor}`}>
                            {item.units_available}
                          </span>
                          <span className="text-xs text-gray-400">units</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {item.units_needed > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-warning-50 px-2 py-1 text-xs font-semibold text-warning-700 ring-1 ring-warning-200">
                            {item.units_needed} units
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="w-32">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={`h-full transition-all duration-300 ${barColor}`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-gray-400">
                        {timeAgo(item.last_updated)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   CAMPS TAB (Read-Only List of Donation Camps Hosted by this Hospital)
   ========================================================================= */

function ContactCampModal({
  camp,
  hospital,
  onClose,
}: {
  camp: BloodCamp;
  hospital: Hospital;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [message, setMessage] = useState('Hi, I am interested in donating blood at this camp.');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const campPhone = hospital.phone || '+91 1800 180 1104';
  const cleanPhone = campPhone.replace(/[^+\d]/g, '');
  const organizerText = camp.organizer || `${hospital.name} Blood Bank`;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-xs transition-opacity duration-200" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto text-left">
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-900">Contact Donation Camp</h3>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 transition-all duration-150 hover:bg-gray-100 hover:text-gray-700 hover:rotate-90 active:scale-90 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
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
                <Building2 className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                <span>Hospital: <strong className="text-gray-800">{hospital.name}</strong></span>
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
                  Thank you, <strong>{name || 'Donor'}</strong>. Your message has been sent to {hospital.name} blood collection desk. They will get in touch with you shortly.
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
                    placeholder="e.g. Can I walk in without an appointment?"
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
                    Send Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CampsTab({ camps, hospital }: { camps: BloodCamp[]; hospital: Hospital }) {
  const [contactCamp, setContactCamp] = useState<BloodCamp | null>(null);
  const campPhone = hospital.phone || '+91 1800 180 1104';
  const cleanPhone = campPhone.replace(/[^+\d]/g, '');

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Donation Camps at {hospital.name}</h2>
        <p className="text-sm text-gray-500">Upcoming community donation drives and blood collection events</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {camps.length === 0 ? (
          <div className="col-span-full rounded-3xl bg-white p-12 text-center ring-1 ring-gray-100">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm font-semibold text-gray-700">No scheduled camps at this hospital right now</p>
            <p className="mt-1 text-xs text-gray-400">
              Check back soon or consult the regional donation camps list.
            </p>
          </div>
        ) : (
          camps.map((c) => (
            <div key={c.id} className="card overflow-hidden flex flex-col justify-between">
              <div>
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <Calendar className="h-5 w-5" />
                    <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-snug">{c.name}</h3>
                </div>
                <div className="p-5 space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <span>{c.address}, {c.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                    <span>{c.start_time} – {c.end_time}</span>
                  </div>
                  {c.organizer && (
                    <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">
                      Organized by: <strong className="text-gray-600">{c.organizer}</strong>
                    </p>
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
          ))
        )}
      </div>

      {/* Contact Camp Modal */}
      {contactCamp && (
        <ContactCampModal camp={contactCamp} hospital={hospital} onClose={() => setContactCamp(null)} />
      )}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return 'recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
