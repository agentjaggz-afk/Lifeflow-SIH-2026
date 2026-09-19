import React, { useState } from 'react';
import { HospitalRequest, RequestPriority, BloodGroup, RequestStatus } from '../../types';
import {
  Inbox,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  Siren,
  CheckCircle,
  XCircle,
  Truck,
  Send,
  Filter,
  Check,
  Building2
} from 'lucide-react';

interface Props {
  requests: HospitalRequest[];
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string, reason: string) => void;
  onPrepareShipment: (request: HospitalRequest) => void;
}

export const HospitalRequestsView: React.FC<Props> = ({
  requests,
  onAcceptRequest,
  onRejectRequest,
  onPrepareShipment
}) => {
  const [priorityFilter, setPriorityFilter] = useState<RequestPriority | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'ALL'>('ALL');
  const [rejectModalReq, setRejectModalReq] = useState<HospitalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = requests.filter((r) => {
    if (priorityFilter !== 'ALL' && r.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const handleConfirmReject = () => {
    if (!rejectModalReq || !rejectReason.trim()) return;
    onRejectRequest(rejectModalReq.id, rejectReason.trim());
    setRejectModalReq(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Inbox className="w-5 h-5 text-red-600" />
            <span>Hospital Blood Requisition Inflow</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Incoming emergency and scheduled hospital transfusion orders requiring immediate allocation.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs">
          {(['ALL', 'CRITICAL', 'HIGH', 'NORMAL', 'LOW'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                priorityFilter === p
                  ? p === 'CRITICAL'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            No blood requests match this filter.
          </div>
        ) : (
          filtered.map((req) => {
            const isCritical = req.priority === 'CRITICAL';
            const isHigh = req.priority === 'HIGH';

            let priorityBadge = 'bg-slate-100 text-slate-700 border-slate-200';
            let cardBorder = 'border-slate-200';

            if (isCritical) {
              priorityBadge = 'bg-red-600 text-white border-red-700 font-extrabold animate-pulse';
              cardBorder = 'border-red-300 ring-2 ring-red-400 bg-red-50/20';
            } else if (isHigh) {
              priorityBadge = 'bg-amber-500 text-white border-amber-600 font-bold';
              cardBorder = 'border-amber-300';
            }

            return (
              <div
                key={req.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${cardBorder}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  {/* Left: Request Title & Hospital */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-xl text-white shadow-xs ${
                        isCritical ? 'bg-red-600 shadow-red-200' : 'bg-slate-900'
                      }`}
                    >
                      {req.bloodGroup}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-extrabold text-sm text-slate-900">
                          REQUEST #{req.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs border uppercase tracking-wider ${priorityBadge}`}>
                          {req.priority} PRIORITY
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          Status: {req.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {req.hospitalName}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Middle: Required Units & Deadline */}
                  <div className="flex items-center gap-6 bg-slate-50 p-3 rounded-2xl border border-slate-100 shrink-0">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Required Units
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl font-extrabold font-mono text-red-600">
                          {req.requiredUnits}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">units ({req.component})</span>
                      </div>
                    </div>

                    <div className="border-l border-slate-200 pl-6">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Required By Deadline
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 font-bold text-sm text-slate-800">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span>{req.requiredBy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes / Clinical Urgency Reason */}
                {req.urgencyReason && (
                  <div className="py-3 text-xs text-slate-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Clinical Indication:</strong> {req.urgencyReason}
                      {req.notes && ` — ${req.notes}`}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${req.contactPhone}`}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>Contact Hospital ({req.contactPhone})</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => setRejectModalReq(req)}
                          className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                        >
                          Reject Request
                        </button>
                        <button
                          onClick={() => onAcceptRequest(req.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept Request</span>
                        </button>
                      </>
                    )}

                    {req.status === 'Accepted' && (
                      <button
                        onClick={() => onPrepareShipment(req)}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-red-200"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Prepare Cold-Chain Shipment</span>
                      </button>
                    )}

                    {req.status === 'Dispatched' && (
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-xl text-xs flex items-center gap-1 border border-blue-200">
                        <Truck className="w-3.5 h-3.5" />
                        Shipment En Route
                      </span>
                    )}

                    {req.status === 'Rejected' && (
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-500 font-semibold rounded-xl text-xs">
                        Requisition Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">
              Reject Requisition #{rejectModalReq.id}
            </h3>
            <p className="text-xs text-slate-500">
              Please enter the clinical or inventory reason for rejecting this requisition for {rejectModalReq.hospitalName}.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Current donor reserve reserved for acute mass casualty event, or incompatibility."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalReq(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
