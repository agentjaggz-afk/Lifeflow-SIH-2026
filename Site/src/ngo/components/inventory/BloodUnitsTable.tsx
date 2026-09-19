import React, { useState, useMemo } from 'react';
import { BloodUnit, BloodGroup, BloodUnitStatus, BLOOD_GROUPS } from '../../types';
import {
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  AlertCircle,
  Truck,
  PlusCircle,
  QrCode
} from 'lucide-react';

interface Props {
  bloodUnits: BloodUnit[];
  initialGroupFilter?: BloodGroup | 'ALL';
  onSelectUnit: (unit: BloodUnit) => void;
  onOpenScanModal: () => void;
  onOpenManualModal: () => void;
}

export const BloodUnitsTable: React.FC<Props> = ({
  bloodUnits,
  initialGroupFilter = 'ALL',
  onSelectUnit,
  onOpenScanModal,
  onOpenManualModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<BloodGroup | 'ALL'>(initialGroupFilter);
  const [statusFilter, setStatusFilter] = useState<BloodUnitStatus | 'ALL'>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Extract unique storage locations
  const storageLocations = useMemo(() => {
    const locs = new Set<string>();
    bloodUnits.forEach((u) => {
      if (u.storageLocation) locs.add(u.storageLocation.split('[')[0].trim());
    });
    return Array.from(locs);
  }, [bloodUnits]);

  // Filtered and searched data
  const filteredUnits = useMemo(() => {
    return bloodUnits.filter((unit) => {
      // Group filter
      if (groupFilter !== 'ALL' && unit.bloodGroup !== groupFilter) return false;
      // Status filter
      if (statusFilter !== 'ALL' && unit.status !== statusFilter) return false;
      // Location filter
      if (locationFilter !== 'ALL' && !unit.storageLocation.includes(locationFilter)) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = unit.id.toLowerCase().includes(q);
        const matchesDonor = unit.donorId.toLowerCase().includes(q);
        const matchesCenter = unit.collectionCenter.toLowerCase().includes(q);
        const matchesDest = (unit.destinationHospital || '').toLowerCase().includes(q);
        if (!matchesId && !matchesDonor && !matchesCenter && !matchesDest) return false;
      }
      return true;
    });
  }, [bloodUnits, groupFilter, statusFilter, locationFilter, searchQuery]);

  const totalPages = Math.ceil(filteredUnits.length / pageSize) || 1;
  const paginatedUnits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUnits.slice(start, start + pageSize);
  }, [filteredUnits, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* Top Controls & Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Blood Units Cold Chain Registry</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
              {filteredUnits.length} Units
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, and inspect individual unit lifecycle timelines and test accreditations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenScanModal}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-red-200"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Barcode</span>
          </button>
          <button
            onClick={onOpenManualModal}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-slate-600" />
            <span>Manual Add</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Unit ID, Donor ID, Hospital..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
          </div>

          {/* Blood Group Filter */}
          <div>
            <select
              value={groupFilter}
              onChange={(e) => {
                setGroupFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            >
              <option value="ALL">All Blood Groups (8 Groups)</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  Blood Group {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Quarantined">Quarantined</option>
              <option value="Expired">Expired</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>

          {/* Storage Location Filter */}
          <div>
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            >
              <option value="ALL">All Storage Locations</option>
              {storageLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {(groupFilter !== 'ALL' || statusFilter !== 'ALL' || locationFilter !== 'ALL' || searchQuery) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">Filters:</span>
            {groupFilter !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[11px] flex items-center gap-1">
                {groupFilter}
                <button onClick={() => setGroupFilter('ALL')}>×</button>
              </span>
            )}
            {statusFilter !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-semibold text-[11px] flex items-center gap-1">
                {statusFilter}
                <button onClick={() => setStatusFilter('ALL')}>×</button>
              </span>
            )}
            {locationFilter !== 'ALL' && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-[11px] flex items-center gap-1">
                {locationFilter}
                <button onClick={() => setLocationFilter('ALL')}>×</button>
              </span>
            )}
            <button
              onClick={() => {
                setGroupFilter('ALL');
                setStatusFilter('ALL');
                setLocationFilter('ALL');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-red-600 hover:text-red-800 font-bold underline ml-auto text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Unit ID / Barcode</th>
                <th className="py-3 px-3">Blood Group</th>
                <th className="py-3 px-3">Component</th>
                <th className="py-3 px-3">Collection Date</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3">Cold Storage Location</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Destination</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUnits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No blood units match the specified filters.
                  </td>
                </tr>
              ) : (
                paginatedUnits.map((u) => {
                  let statusPill = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (u.status === 'Reserved') statusPill = 'bg-amber-50 text-amber-800 border-amber-200';
                  if (u.status === 'Dispatched') statusPill = 'bg-blue-50 text-blue-800 border-blue-200';
                  if (u.status === 'Delivered') statusPill = 'bg-slate-100 text-slate-700 border-slate-300';
                  if (u.status === 'Quarantined') statusPill = 'bg-purple-50 text-purple-700 border-purple-200';
                  if (u.status === 'Expired' || u.status === 'Damaged') statusPill = 'bg-red-50 text-red-700 border-red-200';

                  return (
                    <tr
                      key={u.id}
                      onClick={() => onSelectUnit(u)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {u.id}
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-700 font-extrabold text-xs border border-red-200">
                          {u.bloodGroup}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {u.component}
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        {u.collectionDate}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`font-semibold ${u.expiryDate.includes('Sep') ? 'text-red-700' : 'text-slate-800'}`}>
                          {u.expiryDate}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-700 font-mono text-[11px]">
                        {u.storageLocation}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusPill}`}>
                          {u.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-600 truncate max-w-[140px]">
                        {u.destinationHospital || '—'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectUnit(u);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition inline-flex items-center gap-1 border border-red-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Timeline</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredUnits.length)} of{' '}
            {filteredUnits.length} total units
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
