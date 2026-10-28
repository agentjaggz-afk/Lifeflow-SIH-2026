import { useState, useRef } from 'react';
import { MapPin, Navigation, Search, Building2, Droplet, Heart, Activity, Users, ShieldCheck, ArrowLeft } from 'lucide-react';
import { getOfflineHospitals } from '@/lib/offlineData';

interface LocationGateProps {
  onLocationSet: (city: string, coords: { lat: number; lng: number } | null) => void;
  currentCity?: string;
  onCancel?: () => void;
}

const POPULAR_CITIES = [
  'Bhubaneswar',
  'Cuttack',
  'Berhampur',
  'Rourkela',
  'Sambalpur',
  'Puri',
  'Kolkata',
  'Delhi',
];

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Bhubaneswar: { lat: 20.2961, lng: 85.8245 },
  Cuttack: { lat: 20.4625, lng: 85.8828 },
  Berhampur: { lat: 19.3140, lng: 84.7941 },
  Rourkela: { lat: 22.2570, lng: 84.8620 },
  Sambalpur: { lat: 21.4670, lng: 83.9780 },
  Puri: { lat: 19.8080, lng: 85.8260 },
  Kolkata: { lat: 22.5690, lng: 88.3970 },
  Delhi: { lat: 28.5672, lng: 77.2100 },
};

function getNearestCity(lat: number, lng: number): string {
  let nearestCity = 'Bhubaneswar';
  let minDist = Infinity;
  for (const [cityName, coord] of Object.entries(CITY_COORDS)) {
    const dist = Math.hypot(lat - coord.lat, lng - coord.lng);
    if (dist < minDist) {
      minDist = dist;
      nearestCity = cityName;
    }
  }
  return nearestCity;
}

import { UserProfileMenu } from '@/components/UserProfileMenu';

export function LocationGate({ onLocationSet, currentCity, onCancel }: LocationGateProps) {
  const [manualCity, setManualCity] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hospitalCount = getOfflineHospitals().length;

  const handleGPS = () => {
    setDetecting(true);
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      setDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDetecting(false);
        const matchedCity = getNearestCity(latitude, longitude);
        onLocationSet(matchedCity, { lat: latitude, lng: longitude });
      },
      (err) => {
        setDetecting(false);
        setGpsError(
          err.code === 1
            ? 'Location access denied. Please enter your city manually.'
            : 'Unable to detect location. Please enter your city manually.',
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleManual = () => {
    if (manualCity.trim()) {
      onLocationSet(manualCity.trim(), null);
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950" />
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%), radial-gradient(circle at 60% 80%, rgba(255,255,255,0.08) 0%, transparent 40%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-5 md:px-12">
          <a href="/index.html" className="flex items-start hover:opacity-90 transition-opacity cursor-pointer" title="Return to Portal Gateway">
            <img src="/lifeflow-logo.png" alt="Life Flow" className="h-10 sm:h-12 md:h-14 w-auto rounded-xl bg-white p-1 sm:p-1.5 shadow-md object-contain" />
            <sup className="text-white text-base font-bold ml-1 -mt-1">*</sup>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <UserProfileMenu variant="dark" currentCity={currentCity} />
            <a href="/index.html" className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 sm:px-3.5 sm:py-2 backdrop-blur-sm ring-1 ring-white/20 text-xs font-medium text-white/90 hover:bg-white/20 transition-colors cursor-pointer" title="Back to All Portals">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">All Portals</span>
            </a>
          </div>
        </header>

        {/* Hero */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-12">
          <div className="w-full max-w-2xl animate-fade-in text-center">
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 sm:px-4 sm:py-1.5 backdrop-blur-sm ring-1 ring-white/20">
              <Activity className="h-3.5 w-3.5 text-white/80" />
              <span className="text-[11px] sm:text-xs font-medium text-white/80">Live blood metrics in your area</span>
              <sup className="text-white/90 text-xs font-bold -ml-1">*</sup>
            </div>
            <h2 className="mb-3 text-2xl font-bold leading-snug text-white sm:text-3xl md:text-5xl md:leading-tight">
              Connecting donors, receivers,<br className="hidden sm:inline" /> hospitals &amp; blood camps
            </h2>
            <p className="mb-6 text-xs text-white/70 sm:text-sm md:mb-10 md:text-lg">
              Real-time blood availability across every blood group and component.
              Find donors, track inventory, and save lives — all in one network.
            </p>

            {/* Location card */}
            <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-2xl md:p-8 animate-slide-up">
              <div className="mb-4 sm:mb-5 flex items-start justify-between">
                <div className="text-left">
                  <h3 className="mb-1 text-lg sm:text-xl font-bold text-gray-900">
                    {currentCity ? 'Change Location' : 'Where are you?'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {currentCity
                      ? `Currently viewing blood data for ${currentCity}. Select or search a new city below.`
                      : 'Set your location to see real-time blood data near you.'}
                  </p>
                </div>
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="shrink-0 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-all duration-150 hover:bg-gray-200 active:scale-95 cursor-pointer ml-3"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* GPS button */}
              <button
                onClick={handleGPS}
                disabled={detecting}
                className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-primary-50 px-6 py-4 text-sm font-semibold text-primary-700 ring-1 ring-primary-100 transition-all duration-200 hover:bg-primary-100 hover:ring-primary-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                <Navigation className={`h-5 w-5 ${detecting ? 'animate-spin' : ''}`} />
                {detecting ? 'Detecting your location...' : 'Use my current location (GPS)'}
              </button>

              {gpsError && (
                <p className="mb-4 rounded-lg bg-error-50 px-4 py-2 text-sm text-error-600 animate-slide-down">{gpsError}</p>
              )}

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs font-medium text-gray-400">OR</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              {/* Manual input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManual()}
                    placeholder="Enter your city (e.g. Bhubaneswar)..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleManual}
                  aria-label="Search city location"
                  className="btn-primary btn-location-search shrink-0 flex items-center justify-center rounded-xl cursor-pointer"
                  style={{
                    height: '48px',
                    padding: '0 20px',
                    background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 50%, #450a0a 100%)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 14px rgba(185, 28, 28, 0.4)',
                    opacity: 1,
                  }}
                  title="Search city location"
                >
                  <Search className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Popular cities */}
              <div className="mt-5">
                <p className="mb-2 text-xs font-medium text-gray-400">Popular cities</p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CITIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => onLocationSet(c, null)}
                      className="rounded-full bg-gray-50 px-3.5 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-100 transition-all duration-150 hover:bg-primary-50 hover:text-primary-700 hover:ring-primary-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-90 cursor-pointer"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 sm:mt-10 grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { icon: Users, label: 'Donors', value: 'Network' },
                { icon: Building2, label: 'Hospitals', value: `${hospitalCount}+` },
                { icon: Heart, label: 'Lives Saved', value: 'Real-time' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl sm:rounded-2xl bg-white/5 p-2.5 sm:p-4 backdrop-blur-sm ring-1 ring-white/10 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg">
                  <s.icon className="mx-auto mb-1 sm:mb-2 h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
                  <p className="text-xs sm:text-sm font-semibold text-white">{s.value}</p>
                  <p className="text-[10px] sm:text-xs text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="px-6 py-5 text-center md:px-12">
          <p className="text-xs text-white/40">LifeFlow — Every drop counts. Every donor matters.</p>
        </footer>
      </div>
    </div>
  );
}
