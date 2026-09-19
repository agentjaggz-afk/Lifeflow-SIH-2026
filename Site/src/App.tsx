import { useState, useCallback } from 'react';
import { LocationGate } from '@/components/LocationGate';
import { DonorReceiverView } from '@/components/DonorReceiverView';
import { HospitalView } from '@/components/HospitalView';
import { Hospital } from '@/lib/supabase';

type View = 'location' | 'donor-receiver' | 'hospital';

const SAVED_CITY_KEY = 'lifeflow_saved_city';
const SAVED_COORDS_KEY = 'lifeflow_saved_coords';

function getInitialLocation(): { view: View; city: string; coords: { lat: number; lng: number } | null } {
  const urlParams = new URLSearchParams(window.location.search);
  const isFromCredit = urlParams.get('from') === 'credit' || urlParams.get('return') === 'dashboard';
  const authSuccess = urlParams.get('auth') === 'success';
  const incomingUser = urlParams.get('user');
  const incomingRole = urlParams.get('role');

  if (authSuccess || incomingUser || incomingRole) {
    try {
      if (incomingUser) localStorage.setItem('lifeflow_user_name', incomingUser);
      if (incomingRole) localStorage.setItem('lifeflow_user_role', incomingRole);
      localStorage.setItem('lifeflow_authenticated', 'true');
      window.history.replaceState({}, '', window.location.pathname);
    } catch (e) {
      console.error('Failed to handle incoming auth parameters', e);
    }
  }

  let savedCity = '';
  let savedCoords: { lat: number; lng: number } | null = null;
  try {
    savedCity = localStorage.getItem(SAVED_CITY_KEY) || '';
    const savedCoordsRaw = localStorage.getItem(SAVED_COORDS_KEY);
    savedCoords = savedCoordsRaw ? JSON.parse(savedCoordsRaw) : null;
  } catch (e) {
    console.error('Failed to read saved location from localStorage', e);
  }

  // When returning from rewards/profiles section, redirect directly to the main dashboard
  if (isFromCredit && savedCity.trim().length > 0) {
    try {
      window.history.replaceState({}, '', window.location.pathname);
    } catch {
      // ignore
    }
    return {
      view: 'donor-receiver',
      city: savedCity.trim(),
      coords: savedCoords,
    };
  }

  // Otherwise, while opening the website fresh, ALWAYS show the choose location page first!
  return {
    view: 'location',
    city: savedCity.trim(),
    coords: savedCoords,
  };
}

function App() {
  const [initial] = useState(getInitialLocation);
  const [view, setView] = useState<View>(initial.view);
  const [city, setCity] = useState<string>(initial.city);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(initial.coords);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isChangingLocation, setIsChangingLocation] = useState(false);

  const handleLocationSet = useCallback(
    (newCity: string, newCoords: { lat: number; lng: number } | null) => {
      setCity(newCity);
      setCoords(newCoords);
      setIsChangingLocation(false);
      try {
        localStorage.setItem(SAVED_CITY_KEY, newCity);
        if (newCoords) {
          localStorage.setItem(SAVED_COORDS_KEY, JSON.stringify(newCoords));
        } else {
          localStorage.removeItem(SAVED_COORDS_KEY);
        }
      } catch (e) {
        console.error('Failed to save location to localStorage', e);
      }
      setView('donor-receiver');
    },
    [],
  );

  const handleSelectHospital = useCallback((h: Hospital) => {
    setSelectedHospital(h);
    setView('hospital');
  }, []);

  const handleChangeLocationClick = useCallback(() => {
    setIsChangingLocation(true);
    setView('location');
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf6f3] overflow-x-hidden">
      {view === 'location' && (
        <div key="view-location" className="animate-page-enter">
          <LocationGate
            currentCity={isChangingLocation ? city : undefined}
            onCancel={
              isChangingLocation && city
                ? () => {
                    setIsChangingLocation(false);
                    setView('donor-receiver');
                  }
                : undefined
            }
            onLocationSet={handleLocationSet}
          />
        </div>
      )}
      {view === 'donor-receiver' && (
        <div key="view-donor-receiver" className="animate-page-enter">
          <DonorReceiverView
            city={city}
            coords={coords}
            onBack={handleChangeLocationClick}
            onSelectHospital={handleSelectHospital}
          />
        </div>
      )}
      {view === 'hospital' && selectedHospital && (
        <div key={`view-hospital-${selectedHospital.id}`} className="animate-page-enter">
          <HospitalView
            hospital={selectedHospital}
            city={city}
            onBack={() => setView('donor-receiver')}
          />
        </div>
      )}
    </div>
  );
}

export default App;
