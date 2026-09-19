import { useState, useCallback } from 'react';
import { LocationGate } from '@/components/LocationGate';
import { DonorReceiverView } from '@/components/DonorReceiverView';
import { HospitalView } from '@/components/HospitalView';
import { Hospital } from '@/lib/data';

type View = 'location' | 'donor-receiver' | 'hospital';

function App() {
  const [view, setView] = useState<View>('location');
  const [city, setCity] = useState<string>('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const handleLocationSet = useCallback(
    (newCity: string, newCoords: { lat: number; lng: number } | null) => {
      setCity(newCity);
      setCoords(newCoords);
    },
    [],
  );

  const handleSelectHospital = useCallback((h: Hospital) => {
    setSelectedHospital(h);
    setView('hospital');
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf6f3]">
      {view === 'location' && (
        <LocationGate
          onLocationSet={(c, co) => {
            handleLocationSet(c, co);
            setView('donor-receiver');
          }}
          onSelectHospital={handleSelectHospital}
        />
      )}
      {view === 'donor-receiver' && (
        <DonorReceiverView
          city={city}
          coords={coords}
          onBack={() => setView('location')}
          onSelectHospital={handleSelectHospital}
        />
      )}
      {view === 'hospital' && selectedHospital && (
        <HospitalView
          hospital={selectedHospital}
          city={city}
          onBack={() => setView('donor-receiver')}
        />
      )}
    </div>
  );
}

export default App;
