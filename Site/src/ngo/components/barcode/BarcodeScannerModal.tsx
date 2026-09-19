import React, { useState, useEffect, useRef } from 'react';
import { BloodUnit, BloodGroup, BloodComponent } from '../../types';
import { BarcodeService, PRESET_BARCODES } from '../../services/barcodeService';
import {
  QrCode,
  Camera,
  X,
  CheckCircle,
  AlertTriangle,
  Zap,
  RotateCcw,
  Sparkles,
  Layers,
  Calendar,
  Thermometer,
  ShieldCheck,
  Check
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAdd: (unit: BloodUnit) => void;
}

export const BarcodeScannerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirmAdd
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [activeTab, setActiveTab] = useState<'simulate' | 'camera'>('simulate');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedUnit, setScannedUnit] = useState<BloodUnit | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [isLaserScanning, setIsLaserScanning] = useState(false);
  const [scanSuccessAnim, setScanSuccessAnim] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera when camera tab is selected
  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError('Camera access not supported on this browser. Use Simulated Scanner.');
      }
    } catch (err) {
      console.warn('Camera permission denied or unavailable', err);
      setCameraError('Camera access unavailable or blocked. You can use the Interactive Laser Simulator.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  if (!isOpen) return null;

  const handleScanCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) return;

    setBarcodeInput(code);
    setIsLaserScanning(true);
    setDuplicateWarning(null);

    setTimeout(() => {
      setIsLaserScanning(false);
      
      // Validate
      const validation = BarcodeService.validateBarcode(code);
      if (!validation.valid) {
        setDuplicateWarning(validation.reason || 'Invalid barcode format.');
        setScannedUnit(null);
        return;
      }

      // Check duplicate
      const isDup = BarcodeService.checkDuplicate(code);
      if (isDup) {
        setDuplicateWarning(`DUPLICATE DETECTED: Unit ID ${code} is already registered in cold-chain storage!`);
        setScannedUnit(null);
        return;
      }

      // Generate Unit Details
      const unit = BarcodeService.createBloodUnitFromBarcode(code);
      setScannedUnit(unit);
      setScanSuccessAnim(true);
      setTimeout(() => setScanSuccessAnim(false), 1200);
    }, 450);
  };

  const handleConfirm = () => {
    if (!scannedUnit) return;
    onConfirmAdd(scannedUnit);
    // Reset scanner for next scan
    setScannedUnit(null);
    setBarcodeInput('');
    setDuplicateWarning(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs shadow-red-200">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Barcode Blood Unit Registration
              </h2>
              <p className="text-xs text-slate-500">
                ISBT-128 Compliant Cold Chain Unit Scanning
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: Simulator vs Camera */}
        <div className="px-6 pt-4 flex gap-2 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('simulate')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'simulate'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Laser Simulator & Presets</span>
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Scanner (WebRTC)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* CAMERA VIEWPORT MODE */}
          {activeTab === 'camera' && (
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border border-slate-800">
              {cameraError ? (
                <div className="p-6 text-center text-slate-400">
                  <Camera className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-xs text-slate-300 font-semibold mb-1">{cameraError}</p>
                  <button
                    onClick={() => setActiveTab('simulate')}
                    className="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Switch to Simulator
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Targeting Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-36 border-2 border-dashed border-red-500 rounded-xl relative shadow-lg">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] p-2 rounded-xl text-center">
                    Align blood bag barcode inside the red target frame
                  </div>
                </>
              )}
            </div>
          )}

          {/* SIMULATED SCANNER VIEWPORT */}
          {activeTab === 'simulate' && (
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-5 text-center overflow-hidden">
              {/* Laser Animation Sweep */}
              <div className="relative w-full max-w-sm mx-auto h-28 bg-slate-900/90 rounded-xl border border-slate-700 flex flex-col items-center justify-center overflow-hidden shadow-inner">
                {isLaserScanning && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ef4444] animate-bounce z-10" />
                )}

                {/* Simulated Barcode Graphic */}
                <div className="flex items-center gap-1 opacity-70">
                  <div className="w-1.5 h-14 bg-white"></div>
                  <div className="w-0.5 h-14 bg-white"></div>
                  <div className="w-2.5 h-14 bg-white"></div>
                  <div className="w-1 h-14 bg-white"></div>
                  <div className="w-3 h-14 bg-white"></div>
                  <div className="w-0.5 h-14 bg-white"></div>
                  <div className="w-2 h-14 bg-white"></div>
                  <div className="w-1.5 h-14 bg-white"></div>
                  <div className="w-3.5 h-14 bg-white"></div>
                  <div className="w-1 h-14 bg-white"></div>
                  <div className="w-2 h-14 bg-white"></div>
                </div>
                <span className="font-mono text-xs text-slate-400 mt-1 tracking-widest">
                  {barcodeInput || 'BL-IND-XXXXXXX'}
                </span>
              </div>

              {/* Fast-Click Preset Barcodes */}
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Fast Demo Barcode Presets (Click to Auto-Scan)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_BARCODES.map((p) => (
                    <button
                      key={p.barcode}
                      type="button"
                      onClick={() => handleScanCode(p.barcode)}
                      className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-red-500 text-left transition text-white group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-red-400 group-hover:text-red-300">
                          {p.bloodGroup}
                        </span>
                        <span className="text-[10px] text-slate-400">{p.component.split(' ')[0]}</span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-300 truncate mt-0.5">
                        {p.barcode}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Manual Barcode Input Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value.toUpperCase())}
                placeholder="Enter or paste Barcode (e.g. BL-IND-0001842)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleScanCode(barcodeInput);
                }}
              />
            </div>
            <button
              onClick={() => handleScanCode(barcodeInput)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify & Scan</span>
            </button>
          </div>

          {/* Duplicate Warning Alert */}
          {duplicateWarning && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong>Validation Notice:</strong> {duplicateWarning}
              </div>
            </div>
          )}

          {/* SCANNED UNIT CARD PREVIEW */}
          {scannedUnit && (
            <div
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                scanSuccessAnim
                  ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400 scale-[1.01]'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-extrabold text-lg">
                    {scannedUnit.bloodGroup}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Scanned Blood Unit Information
                    </span>
                    <h3 className="text-sm font-extrabold font-mono text-slate-900">
                      {scannedUnit.id}
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Validated Available
                </span>
              </div>

              {/* Metadata Grid */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Component</span>
                  <strong className="text-slate-800">{scannedUnit.component}</strong>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Rh Factor</span>
                  <strong className="text-slate-800">{scannedUnit.rhFactor === '+' ? 'Positive (+ve)' : 'Negative (-ve)'}</strong>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Volume</span>
                  <strong className="text-slate-800">{scannedUnit.volumeMl} mL</strong>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Collection Date</span>
                  <strong className="text-slate-800">{scannedUnit.collectionDate}</strong>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Expiry Date</span>
                  <strong className="text-red-700 font-bold">{scannedUnit.expiryDate}</strong>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Donor / Donation ID</span>
                  <strong className="text-slate-800 font-mono">{scannedUnit.donorId}</strong>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl sm:col-span-2">
                  <span className="text-[10px] text-slate-400 block font-medium">Collection Center</span>
                  <strong className="text-slate-800 truncate block">{scannedUnit.collectionCenter}</strong>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Storage Cold Chain</span>
                  <strong className="text-slate-800 font-medium">{scannedUnit.storageLocation}</strong>
                </div>
              </div>

              {/* Confirmation Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setScannedUnit(null);
                    setBarcodeInput('');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-red-200"
                >
                  <Check className="w-4 h-4" />
                  <span>Add Unit to Inventory</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
