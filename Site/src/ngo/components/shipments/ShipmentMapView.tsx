import React, { useState, useEffect } from 'react';
import { Shipment } from '../../types';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Navigation,
  Compass,
  Zap,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  shipment: Shipment;
  onUpdateStatus: (newStatus: any, progress: number) => void;
}

export const ShipmentMapView: React.FC<Props> = ({ shipment, onUpdateStatus }) => {
  const [progress, setProgress] = useState(shipment.routeProgress || 25);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    setProgress(shipment.routeProgress || 25);
  }, [shipment.routeProgress]);

  // Simulate truck moving forward along the route
  const handleSimulateStep = () => {
    const nextProg = Math.min(100, progress + 25);
    setProgress(nextProg);

    let status = shipment.status;
    if (nextProg >= 100) {
      status = 'Delivered';
    } else if (nextProg >= 75) {
      status = 'Arriving';
    } else if (nextProg >= 35) {
      status = 'In Transit';
    } else {
      status = 'Picked Up';
    }

    onUpdateStatus(status, nextProg);
  };

  // Route markers SVG calculations
  const truckX = 70 + (progress / 100) * 460;
  const truckY = 90 + Math.sin((progress / 100) * Math.PI) * -35;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Map Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold text-sm text-slate-900">
              {shipment.id}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              shipment.status === 'Delivered'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-blue-100 text-blue-800 animate-pulse'
            }`}>
              {shipment.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active Cold-Chain Route: <strong>{shipment.origin}</strong> → <strong>{shipment.hospitalName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {shipment.status !== 'Delivered' && (
            <button
              onClick={handleSimulateStep}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Next GPS Waypoint</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulated Vector GPS Route Map Viewport */}
      <div className="relative bg-slate-900 h-64 sm:h-72 w-full overflow-hidden flex items-center justify-center select-none">
        
        {/* Map Grid Background Pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Road Network Lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Secondary road paths */}
          <path
            d="M 30 140 Q 200 40 400 130 T 650 60"
            fill="none"
            stroke="#334155"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
          <path
            d="M 120 220 Q 300 200 500 180 T 680 200"
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
          />

          {/* Primary Route Path (Glow & Active line) */}
          <path
            d="M 70 90 Q 250 20 530 90"
            fill="none"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
            className="filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]"
          />
          <path
            d="M 70 90 Q 250 20 530 90"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            className="animate-pulse"
          />

          {/* Origin Marker (NGO Blood Bank) */}
          <g transform="translate(70, 90)">
            <circle r="14" fill="#dc2626" opacity="0.3" className="animate-ping" />
            <circle r="9" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Destination Marker (Hospital) */}
          <g transform="translate(530, 90)">
            <circle r="14" fill="#2563eb" opacity="0.3" className="animate-ping" />
            <circle r="9" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Moving Vehicle Marker */}
          <g transform={`translate(${truckX}, ${truckY})`} className="transition-all duration-700">
            <circle r="18" fill="#ffffff" opacity="0.2" className="animate-pulse" />
            <circle r="12" fill="#0f172a" stroke="#ef4444" strokeWidth="2.5" />
            <path
              d="M -5 -3 L 5 -3 L 3 4 L -3 4 Z"
              fill="#ffffff"
            />
          </g>
        </svg>

        {/* Origin Pill (Top Left) */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-xs border border-slate-700 text-white p-2.5 rounded-xl text-xs max-w-xs shadow-lg">
          <div className="flex items-center gap-1.5 text-red-400 font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Origin: {shipment.origin}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Cold storage dispatch hub</p>
        </div>

        {/* Destination Pill (Top Right) */}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-xs border border-slate-700 text-white p-2.5 rounded-xl text-xs max-w-xs shadow-lg text-right">
          <div className="flex items-center justify-end gap-1.5 text-blue-400 font-bold">
            <span>Destination: {shipment.hospitalName}</span>
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{shipment.destination}</p>
        </div>

        {/* Vehicle Telemetry HUD (Bottom) */}
        <div className="absolute bottom-3 left-4 right-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-white p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-600/30 text-red-400 border border-red-500/40 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block text-slate-200">
                {shipment.vehicleNumber} ({shipment.courier})
              </span>
              <p className="text-[10px] text-slate-400">
                Driver: <strong className="text-slate-300">{shipment.driverName}</strong> • {shipment.driverContact}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Location</span>
              <strong className="text-slate-200">{shipment.currentLocationName}</strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">Distance Remaining</span>
              <strong className="text-amber-400 font-mono">
                {shipment.status === 'Delivered' ? '0.0 km' : `${shipment.distanceRemainingKm} km`}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">Est. Arrival</span>
              <strong className="text-emerald-400 font-mono">{shipment.estimatedArrival}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Progress Bar & Route Steps */}
      <div className="p-4 sm:p-5 bg-white space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Route Fulfillment Progress</span>
          <span className="font-mono text-red-600">{progress}%</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] sm:text-xs">
          <div className={`p-2 rounded-xl ${progress >= 15 ? 'bg-red-50 text-red-800 font-bold' : 'text-slate-400'}`}>
            1. Packing Cleared
          </div>
          <div className={`p-2 rounded-xl ${progress >= 40 ? 'bg-red-50 text-red-800 font-bold' : 'text-slate-400'}`}>
            2. Driver Picked Up
          </div>
          <div className={`p-2 rounded-xl ${progress >= 70 ? 'bg-red-50 text-red-800 font-bold' : 'text-slate-400'}`}>
            3. Corridor Transit
          </div>
          <div className={`p-2 rounded-xl ${progress >= 100 ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-400'}`}>
            4. Delivered to Ward
          </div>
        </div>
      </div>
    </div>
  );
};
