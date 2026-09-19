import React, { useState } from 'react';
import { BloodGroup, BLOOD_GROUPS } from '../../types';
import { Sliders, X, AlertTriangle, Check, Building2, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  initialGroup?: BloodGroup;
  onClose: () => void;
  onSubmit: (params: {
    action: 'add' | 'remove' | 'correct' | 'expired' | 'damaged' | 'reserved' | 'dispatched';
    bloodGroup: BloodGroup;
    quantity: number;
    reason: string;
    destination?: string;
  }) => void;
}

export const ManualUpdateModal: React.FC<Props> = ({
  isOpen,
  initialGroup = 'O+',
  onClose,
  onSubmit
}) => {
  const [action, setAction] = useState<'add' | 'remove' | 'correct' | 'expired' | 'damaged' | 'reserved' | 'dispatched'>('add');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(initialGroup);
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!reason.trim()) {
      setErrorMsg('Mandatory Audit Requirement: Please specify a reason for this inventory adjustment.');
      return;
    }

    if (quantity <= 0) {
      setErrorMsg('Quantity must be greater than 0.');
      return;
    }

    onSubmit({
      action,
      bloodGroup,
      quantity,
      reason: reason.trim(),
      destination: destination.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Sliders className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Manual Inventory Modification
              </h2>
              <p className="text-xs text-slate-500">
                Authorized staff inventory correction & disposal log
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Select */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Adjustment Action <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'add', label: 'Add Units' },
                { id: 'remove', label: 'Remove Units' },
                { id: 'dispatched', label: 'Hospital Dispatch' },
                { id: 'damaged', label: 'Mark Damaged' },
                { id: 'expired', label: 'Mark Expired' },
                { id: 'correct', label: 'Audit Correction' }
              ].map((act) => (
                <button
                  type="button"
                  key={act.id}
                  onClick={() => setAction(act.id as any)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition ${
                    action === act.id
                      ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blood Group & Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Blood Group <span className="text-red-500">*</span>
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Quantity (Units) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Destination (if dispatched or transferred) */}
          {(action === 'dispatched' || action === 'remove') && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Destination / Hospital Name
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Apollo Hospital Sarita Vihar"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>
          )}

          {/* Reason (Mandatory) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Reason for Modification <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">Mandatory for audit trail</span>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="e.g. Emergency inter-facility transfer for trauma patient, or bag leak during centrifugation"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-red-200"
            >
              <Check className="w-4 h-4" />
              <span>Apply Modification & Log Audit</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
