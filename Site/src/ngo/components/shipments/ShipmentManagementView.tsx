import React, { useState } from 'react';
import { Shipment, BloodUnit, ConnectedHospital, HospitalRequest, BloodGroup, ShipmentStatus } from '../../types';
import { ShipmentMapView } from './ShipmentMapView';
import {
  Truck,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  X,
  ChevronRight,
  Boxes,
  User,
  ShieldCheck,
  Eye,
  Check
} from 'lucide-react';

interface Props {
  shipments: Shipment[];
  bloodUnits: BloodUnit[];
  hospitals: ConnectedHospital[];
  requests: HospitalRequest[];
  onCreateShipment: (params: {
    requestId?: string;
    hospitalId: string;
    hospitalName: string;
    destination: string;
    bloodGroup: BloodGroup;
    units: number;
    unitIds: string[];
    courier: string;
    driverName: string;
    driverContact: string;
    vehicleNumber: string;
  }) => void;
  onUpdateShipmentStatus: (shipmentId: string, status: ShipmentStatus, progressPercent?: number) => void;
}

export const ShipmentManagementView: React.FC<Props> = ({
  shipments,
  bloodUnits,
  hospitals,
  requests,
  onCreateShipment,
  onUpdateShipmentStatus
}) => {
  const [activeMapShipment, setActiveMapShipment] = useState<Shipment | null>(
    shipments.find((s) => s.status === 'In Transit') || shipments[0] || null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State for 5-Step Creation
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0]?.id || '');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup>('O+');
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [courierName, setCourierName] = useState('LifeFlow MedExpress Urgent Logistics');
  const [driverName, setDriverName] = useState('Vikram Chawla');
  const [driverContact, setDriverContact] = useState('+91 98118 77654');
  const [vehicleNumber, setVehicleNumber] = useState('DL-01-AX-4821 (Cold Van)');

  // Filter available units matching the selected blood group
  const availableUnitsForGroup = bloodUnits.filter(
    (u) => u.bloodGroup === selectedBloodGroup && u.status === 'Available'
  );

  const handleOpenCreate = (prefillRequest?: HospitalRequest) => {
    if (prefillRequest) {
      setSelectedHospitalId(prefillRequest.hospitalId);
      setSelectedBloodGroup(prefillRequest.bloodGroup);
    }
    setCurrentStep(1);
    setSelectedUnitIds([]);
    setShowCreateModal(true);
  };

  const handleUnitToggle = (id: string) => {
    if (selectedUnitIds.includes(id)) {
      setSelectedUnitIds(selectedUnitIds.filter((u) => u !== id));
    } else {
      setSelectedUnitIds([...selectedUnitIds, id]);
    }
  };

  const handleFinalSubmit = () => {
    const targetHosp = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];
    onCreateShipment({
      hospitalId: targetHosp.id,
      hospitalName: targetHosp.name,
      destination: `${targetHosp.location}, ${targetHosp.city}`,
      bloodGroup: selectedBloodGroup,
      units: selectedUnitIds.length || 1,
      unitIds: selectedUnitIds.length > 0 ? selectedUnitIds : [availableUnitsForGroup[0]?.id || 'BL-IND-0001850'],
      courier: courierName,
      driverName,
      driverContact,
      vehicleNumber
    });
    setShowCreateModal(false);
    setCurrentStep(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-red-600" />
            <span>Shipment Logistics & Cold-Chain Dispatch</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            5-step cold-chain dispatch, live vehicle tracking, and hospital delivery confirmations.
          </p>
        </div>

        <button
          onClick={() => handleOpenCreate()}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-red-200"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Shipment (5-Step)</span>
        </button>
      </div>

      {/* Selected Shipment GPS Route Map */}
      {activeMapShipment && (
        <ShipmentMapView
          shipment={activeMapShipment}
          onUpdateStatus={(status, progress) => {
            onUpdateShipmentStatus(activeMapShipment.id, status, progress);
          }}
        />
      )}

      {/* Shipments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Active & Historical Logistical Shipments
          </h3>
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {shipments.length} Total Shipments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <th className="py-3 px-4">Shipment ID</th>
                <th className="py-3 px-3">Destination Hospital</th>
                <th className="py-3 px-3">Blood Group</th>
                <th className="py-3 px-3">Units</th>
                <th className="py-3 px-3">Driver / Vehicle</th>
                <th className="py-3 px-3">Est. Arrival</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shipments.map((shp) => {
                let statusBadge = 'bg-blue-100 text-blue-800';
                if (shp.status === 'Delivered') statusBadge = 'bg-emerald-100 text-emerald-800';
                if (shp.status === 'Preparing') statusBadge = 'bg-amber-100 text-amber-800';
                if (shp.status === 'Arriving') statusBadge = 'bg-purple-100 text-purple-800 animate-pulse';

                return (
                  <tr
                    key={shp.id}
                    onClick={() => setActiveMapShipment(shp)}
                    className={`hover:bg-slate-50 cursor-pointer transition ${
                      activeMapShipment?.id === shp.id ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {shp.id}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <div>{shp.hospitalName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{shp.destination}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md font-bold font-mono text-xs bg-red-50 text-red-700 border border-red-200">
                        {shp.bloodGroup}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-bold font-mono text-slate-900">
                      {shp.units} units
                    </td>

                    <td className="py-3 px-3 text-slate-700">
                      <div>{shp.driverName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{shp.vehicleNumber}</div>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-600">
                      {shp.estimatedArrival}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBadge}`}>
                        {shp.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMapShipment(shp);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      >
                        Track Map →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5-Step Shipment Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  New Cold-Chain Blood Shipment Workflow
                </h3>
                <p className="text-xs text-slate-500">
                  Step {currentStep} of 5: {
                    currentStep === 1 ? 'Select Available Units' :
                    currentStep === 2 ? 'Hospital Destination' :
                    currentStep === 3 ? 'Assign Logistics Partner & Driver' :
                    currentStep === 4 ? 'Review & Generate Custody ID' :
                    'Tracking Activated'
                  }
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Indicator */}
            <div className="px-6 pt-4 flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentStep === step
                        ? 'bg-red-600 text-white shadow-xs'
                        : currentStep > step
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 5 && <div className="w-8 sm:w-12 h-0.5 bg-slate-200"></div>}
                </div>
              ))}
            </div>

            {/* Step Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* STEP 1: Select Available Units */}
              {currentStep === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Step 1: Choose Blood Group & Units to Dispatch
                    </label>
                    <select
                      value={selectedBloodGroup}
                      onChange={(e) => {
                        setSelectedBloodGroup(e.target.value as BloodGroup);
                        setSelectedUnitIds([]);
                      }}
                      className="px-2 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold"
                    >
                      {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as const).map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-slate-500">
                    Select cold-chain verified units from active inventory ({availableUnitsForGroup.length} available):
                  </p>

                  <div className="space-y-2 max-h-56 overflow-y-auto border border-slate-200 rounded-xl p-2">
                    {availableUnitsForGroup.slice(0, 10).map((u) => {
                      const isChecked = selectedUnitIds.includes(u.id);
                      return (
                        <div
                          key={u.id}
                          onClick={() => handleUnitToggle(u.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer text-xs ${
                            isChecked ? 'bg-red-50 border-red-300 font-bold' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="rounded-sm text-red-600"
                            />
                            <span className="font-mono">{u.id}</span>
                            <span className="text-slate-500 font-normal">({u.component})</span>
                          </div>
                          <span className="font-mono text-slate-600 text-[11px]">{u.storageLocation}</span>
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    Selected Units: {selectedUnitIds.length}
                  </span>
                </div>
              )}

              {/* STEP 2: Hospital Destination */}
              {currentStep === 2 && (
                <div className="space-y-3 text-xs">
                  <label className="font-bold text-slate-700 block">
                    Step 2: Select Recipient Hospital Facility
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {hospitals.map((hosp) => (
                      <div
                        key={hosp.id}
                        onClick={() => setSelectedHospitalId(hosp.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition ${
                          selectedHospitalId === hosp.id
                            ? 'bg-red-50 border-red-300 ring-1 ring-red-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900">{hosp.name}</strong>
                          <span className="font-bold text-red-700 font-mono">{hosp.distanceKm} km</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{hosp.location} • {hosp.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Assign Logistics & Driver */}
              {currentStep === 3 && (
                <div className="space-y-3 text-xs">
                  <label className="font-bold text-slate-700 block">
                    Step 3: Assign Delivery Personnel & Logistics Partner
                  </label>
                  <div>
                    <span className="text-slate-600 font-medium block mb-1">Courier / Logistics Provider</span>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-600 font-medium block mb-1">Driver Name</span>
                      <input
                        type="text"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium block mb-1">Driver Contact Phone</span>
                      <input
                        type="text"
                        value={driverContact}
                        onChange={(e) => setDriverContact(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium block mb-1">Vehicle License & Type</span>
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Summary & Generate ID */}
              {currentStep === 4 && (
                <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm">Step 4: Dispatch Summary Verification</h4>
                  <div className="space-y-1.5 text-slate-700">
                    <p><strong>Hospital:</strong> {hospitals.find((h) => h.id === selectedHospitalId)?.name}</p>
                    <p><strong>Blood Group:</strong> <span className="font-bold text-red-600">{selectedBloodGroup}</span></p>
                    <p><strong>Total Units:</strong> {selectedUnitIds.length || 1} units</p>
                    <p><strong>Assigned Driver:</strong> {driverName} ({driverContact})</p>
                    <p><strong>Transport Vehicle:</strong> {vehicleNumber}</p>
                    <p><strong>Temperature Requirement:</strong> +2°C to +6°C active logging</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Controls */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <button
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((s) => (s - 1) as any)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40"
              >
                Back
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep((s) => (s + 1) as any)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                >
                  <span>Continue Step {currentStep + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinalSubmit}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Generate Shipment & Dispatch</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
