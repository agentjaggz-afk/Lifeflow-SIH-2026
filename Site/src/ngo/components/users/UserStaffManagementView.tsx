import React, { useState } from 'react';
import { StaffUser, UserRole } from '../../types';
import { Users, Shield, Plus, Check, Trash2, Key, Sliders } from 'lucide-react';

interface Props {
  staffUsers: StaffUser[];
  currentUser: StaffUser;
  onSelectUser: (user: StaffUser) => void;
}

export const UserStaffManagementView: React.FC<Props> = ({
  staffUsers,
  currentUser,
  onSelectUser
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Staff');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            <span>Staff Roster & Role-Based Access Control (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage institutional personnel roles, cold chain access authorizations, and emergency dispatch privileges.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Roles & Permissions Breakdown Cards (Requirement #19) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Super Admin & NGO Administrator</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Full authority to broadcast SOS emergencies, modify blood threshold values, manage user accounts, and approve statutory transfers.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Inventory & Cold-Chain Manager</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authority to scan barcodes, intake blood units, perform manual balance corrections, and write off damaged/expired units with mandatory audit logs.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Dispatch & Logistics Coordinator</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authority to accept hospital requests, generate 5-step cold-chain shipments, assign delivery drivers, and track GPS route waypoints.
          </p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Registered Institutional Personnel ({staffUsers.length})
          </h3>
          <span className="text-xs text-slate-500">
            Active Session: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-3">Official Role</th>
                <th className="py-3 px-3">Assigned Permissions</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-4 text-right">Switch Active Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffUsers.map((user) => {
                const isCurrent = user.id === currentUser.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{user.email}</div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-medium">
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {user.permissions.slice(0, 3).map((perm, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-50 border border-slate-200 px-1.5 py-0.2 rounded text-slate-600 font-mono">
                            {perm.replace('_', ' ')}
                          </span>
                        ))}
                        {user.permissions.length > 3 && (
                          <span className="text-[10px] text-slate-400">+{user.permissions.length - 3}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {user.lastActive}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isCurrent ? (
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                          Current Active
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectUser(user)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-red-700 hover:bg-slate-100 rounded-lg transition border border-slate-200"
                        >
                          Switch to User
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
