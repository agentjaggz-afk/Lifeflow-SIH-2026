import React, { useState, useEffect } from 'react';
import { ngoStateService, NgoPlatformState } from './services/ngoStateService';
import {
  ActiveNavPage,
  BloodGroup,
  BloodUnit,
  StaffUser,
  ConnectedHospital,
  HospitalRequest,
  ShipmentStatus
} from './types';
import { NgoNavbar } from './components/layout/NgoNavbar';
import { NgoSidebar } from './components/layout/NgoSidebar';
import { SosAlertBanner } from './components/layout/SosAlertBanner';

import { NgoDashboardView } from './components/dashboard/NgoDashboardView';
import { InventoryView } from './components/inventory/InventoryView';
import { BloodUnitsTable } from './components/inventory/BloodUnitsTable';
import { ExpiryManagementView } from './components/inventory/ExpiryManagementView';

import { BarcodeScannerModal } from './components/barcode/BarcodeScannerModal';
import { ManualUpdateModal } from './components/barcode/ManualUpdateModal';
import { BloodUnitTimelineModal } from './components/barcode/BloodUnitTimelineModal';

import { ConnectedHospitalsView } from './components/hospitals/ConnectedHospitalsView';
import { HospitalRequestsView } from './components/hospitals/HospitalRequestsView';
import { ShipmentManagementView } from './components/shipments/ShipmentManagementView';

import { EmergencyControlCenterView } from './components/emergency/EmergencyControlCenterView';
import { EmergencySosModal } from './components/emergency/EmergencySosModal';

import { AnalyticsView } from './components/analytics/AnalyticsView';
import { NgoNetworkView } from './components/network/NgoNetworkView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ActivityLogView } from './components/activity/ActivityLogView';
import { UserStaffManagementView } from './components/users/UserStaffManagementView';
import { SettingsView } from './components/settings/SettingsView';

import { NgoLoginView } from './components/auth/NgoLoginView';
import { NgoRegisterView } from './components/auth/NgoRegisterView';
import { ToastContainer, ToastMessage } from './components/common/ToastContainer';

export const NgoApp: React.FC = () => {
  const [state, setState] = useState<NgoPlatformState>(() => ngoStateService.getState());
  const [activePage, setActivePage] = useState<ActiveNavPage>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentRegion, setCurrentRegion] = useState<string>(() => {
    return localStorage.getItem('lifeflow_ngo_region') || 'Bhubaneswar, Odisha';
  });

  useEffect(() => {
    localStorage.setItem('lifeflow_ngo_region', currentRegion);
  }, [currentRegion]);

  // Modals state
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualInitialGroup, setManualInitialGroup] = useState<BloodGroup>('O+');
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [selectedTimelineUnit, setSelectedTimelineUnit] = useState<BloodUnit | null>(null);

  // Filter pass-through state
  const [initialTableGroupFilter, setInitialTableGroupFilter] = useState<BloodGroup | 'ALL'>('ALL');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add toast helper
  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `TOAST-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Subscribe to central reactive state service
  useEffect(() => {
    const unsubscribe = ngoStateService.subscribe(() => {
      setState({ ...ngoStateService.getState() });
    });
    return () => unsubscribe();
  }, []);

  // Ensure profile is fully synchronized with active region
  useEffect(() => {
    if (state.profile.name.includes('Delhi') || !state.profile.name.includes('Odisha')) {
      ngoStateService.setRegionalCenter(currentRegion);
    }
  }, [currentRegion]);

  // Sync hash route with page state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'landing') {
        setActivePage('dashboard');
        window.location.hash = '#/dashboard';
      } else if (hash) {
        setActivePage(hash as ActiveNavPage);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: ActiveNavPage) => {
    window.location.hash = `#/${page}`;
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers
  const handleBarcodeAddConfirm = (unit: BloodUnit) => {
    const res = ngoStateService.addBloodUnit(unit);
    if (res.success) {
      addToast('success', 'Blood Unit Added', res.message);
      setIsScanModalOpen(false);
    } else {
      addToast('error', 'Barcode Validation Warning', res.message);
    }
  };

  const handleManualAdjustment = (params: any) => {
    const res = ngoStateService.manualInventoryUpdate(params);
    if (res.success) {
      addToast('success', 'Inventory Updated', res.message);
    } else {
      addToast('error', 'Adjustment Error', res.message);
    }
  };

  const handleSosActivate = (params: any) => {
    ngoStateService.activateSos(params);
    addToast('error', '🚨 SOS Emergency Broadcasted', `High-priority broadcast dispatched for ${params.bloodGroup} units.`);
    navigateTo('emergency');
  };

  const handleSosDeactivate = () => {
    ngoStateService.deactivateSos();
    addToast('info', 'SOS Protocol Stand Down', 'Emergency alert deactivated. System returned to standard operational level.');
  };

  const handleCreateShipment = (params: any) => {
    const shipment = ngoStateService.createShipment(params);
    addToast('success', 'Shipment Dispatched', `Shipment ${shipment.id} created and assigned to ${params.driverName}.`);
  };

  const handleUpdateShipmentStatus = (shipmentId: string, status: ShipmentStatus, progressPercent?: number) => {
    ngoStateService.updateShipmentStatus(shipmentId, status, progressPercent);
    addToast('info', 'Shipment Tracking Update', `Shipment ${shipmentId} updated to ${status}.`);
  };

  // Standalone full-page views (login, register, landing)
  if (activePage === 'login') {
    return (
      <>
        <NgoLoginView
          onLoginSuccess={(name, license) => {
            ngoStateService.updateProfile({ name, licenseNumber: license });
            addToast('success', 'Authenticated Successfully', `Welcome to LifeFlow NGO Portal, ${name}.`);
            navigateTo('dashboard');
          }}
          onNavigateToRegister={() => navigateTo('register')}
        />
        <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
      </>
    );
  }

  if (activePage === 'register') {
    return (
      <>
        <NgoRegisterView
          onRegisterSuccess={(name, license) => {
            ngoStateService.updateProfile({ name, licenseNumber: license });
            addToast('success', 'Registration Verified', `Organization ${name} provisioned with License ${license}.`);
            navigateTo('dashboard');
          }}
          onNavigateToLogin={() => navigateTo('login')}
        />
        <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
      </>
    );
  }

  // Calculate badges
  const pendingRequestsCount = state.requests.filter((r) => r.status === 'Pending').length;
  const inTransitShipmentsCount = state.shipments.filter((s) => s.status === 'In Transit').length;
  const criticalStockCount = state.inventory.filter((i) => i.status === 'Critical').length;
  const unreadNotificationsCount = state.notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#fdf6f3] md:bg-[#f8fafc] text-slate-900 antialiased selection:bg-red-500 selection:text-white">
      
      {/* Desktop & Mobile Left Sidebar - Locked at viewport matching DonorReceiverView */}
      <NgoSidebar
        activePage={activePage}
        currentUser={state.currentUser}
        pendingRequestsCount={pendingRequestsCount}
        inTransitShipmentsCount={inTransitShipmentsCount}
        criticalStockCount={criticalStockCount}
        unreadNotificationsCount={unreadNotificationsCount}
        currentRegion={currentRegion}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={navigateTo}
        onOpenScanModal={() => setIsScanModalOpen(true)}
        onOpenSosModal={() => setIsSosModalOpen(true)}
        onSelectRegion={(r) => {
          setCurrentRegion(r);
          ngoStateService.setRegionalCenter(r);
          addToast('info', 'Region Updated', `Regional operational zone updated to ${r}.`);
        }}
      />

      {/* Main content with left padding to offset fixed sidebar (matching DonorReceiverView) */}
      <main className="flex-1 min-w-0 pl-0 md:pl-64 overflow-x-hidden flex flex-col">
        {/* Sticky Topbar */}
        <NgoNavbar
          profile={state.profile}
          currentUser={state.currentUser}
          staffUsers={state.staffUsers}
          notifications={state.notifications}
          sosAlert={state.sosAlert}
          activePage={activePage}
          currentRegion={currentRegion}
          onNavigate={navigateTo}
          onOpenSosModal={() => setIsSosModalOpen(true)}
          onOpenScanModal={() => setIsScanModalOpen(true)}
          onSelectUser={(u) => {
            ngoStateService.setCurrentUser(u);
            addToast('info', 'Active Personnel Switched', `Now operating as ${u.name} (${u.role}).`);
          }}
          onMarkNotificationRead={(id) => ngoStateService.markNotificationAsRead(id)}
          onMarkAllNotificationsRead={() => {
            ngoStateService.markAllNotificationsAsRead();
            addToast('info', 'Notifications Updated', 'All notifications marked as read.');
          }}
          onToggleMobileSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
          onLogout={() => {
            addToast('info', 'Signed Out', 'You have been signed out of the NGO Portal.');
            navigateTo('login');
          }}
        />

        {/* Top Emergency SOS Banner */}
        <SosAlertBanner
          sosAlert={state.sosAlert}
          inventory={state.inventory}
          onOpenEmergencyView={() => navigateTo('emergency')}
          onDeactivate={handleSosDeactivate}
        />

        {/* Content Page Container */}
        <div className="mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8 pb-20 md:pb-12">
          {activePage === 'dashboard' && (
            <NgoDashboardView
              state={state}
              currentRegion={currentRegion}
              onSelectRegion={(r) => {
                setCurrentRegion(r);
                ngoStateService.setRegionalCenter(r);
                addToast('info', 'Region Updated', `Regional operational zone updated to ${r}.`);
              }}
              onNavigate={navigateTo}
              onOpenScanModal={() => setIsScanModalOpen(true)}
              onOpenManualModal={() => {
                setManualInitialGroup('O+');
                setIsManualModalOpen(true);
              }}
              onOpenSosModal={() => setIsSosModalOpen(true)}
              onPrioritizeUnit={(unitId) => {
                ngoStateService.prioritizeUnitForDispatch(unitId);
                addToast('success', 'Unit Prioritized', `Unit ${unitId} tagged for emergency hospital dispatch.`);
              }}
              onFilterGroup={(group) => {
                setInitialTableGroupFilter(group);
                navigateTo('blood-units');
              }}
            />
          )}

          {activePage === 'inventory' && (
            <InventoryView
              inventory={state.inventory}
              bloodUnits={state.bloodUnits}
              onOpenScanModal={() => setIsScanModalOpen(true)}
              onOpenManualModal={() => {
                setManualInitialGroup('O+');
                setIsManualModalOpen(true);
              }}
              onFilterGroup={(group) => {
                setInitialTableGroupFilter(group);
                navigateTo('blood-units');
              }}
              onViewExpiring={() => navigateTo('blood-units')}
            />
          )}

          {activePage === 'blood-units' && (
            <BloodUnitsTable
              bloodUnits={state.bloodUnits}
              initialGroupFilter={initialTableGroupFilter}
              onSelectUnit={(u) => setSelectedTimelineUnit(u)}
              onOpenScanModal={() => setIsScanModalOpen(true)}
              onOpenManualModal={() => {
                setManualInitialGroup('O+');
                setIsManualModalOpen(true);
              }}
            />
          )}

          {activePage === 'scan' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-4">
              <h2 className="text-base font-bold text-slate-900">Barcode Blood Unit Registration Terminal</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Launch camera-based or laser-simulated scanning to intake new blood donations into the cold chain.
              </p>
              <button
                onClick={() => setIsScanModalOpen(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold transition shadow-sm shadow-red-200"
              >
                Launch Barcode Scanner Modal
              </button>
            </div>
          )}

          {activePage === 'hospitals' && (
            <ConnectedHospitalsView
              hospitals={state.hospitals}
              onRequestBloodForHospital={(hosp) => {
                navigateTo('shipments');
              }}
              onViewHospitalRequests={(hospId) => {
                navigateTo('requests');
              }}
            />
          )}

          {activePage === 'requests' && (
            <HospitalRequestsView
              requests={state.requests}
              onAcceptRequest={(id) => {
                ngoStateService.acceptRequest(id);
                addToast('success', 'Requisition Accepted', `Request #${id} approved. You can now prepare the cold-chain shipment.`);
              }}
              onRejectRequest={(id, reason) => {
                ngoStateService.rejectRequest(id, reason);
                addToast('warning', 'Requisition Rejected', `Request #${id} rejected: ${reason}`);
              }}
              onPrepareShipment={(req) => {
                navigateTo('shipments');
              }}
            />
          )}

          {activePage === 'shipments' && (
            <ShipmentManagementView
              shipments={state.shipments}
              bloodUnits={state.bloodUnits}
              hospitals={state.hospitals}
              requests={state.requests}
              onCreateShipment={handleCreateShipment}
              onUpdateShipmentStatus={handleUpdateShipmentStatus}
            />
          )}

          {activePage === 'emergency' && (
            <EmergencyControlCenterView
              sosAlert={state.sosAlert}
              inventory={state.inventory}
              hospitals={state.hospitals}
              networkPeers={state.networkPeers}
              onOpenSosModal={() => setIsSosModalOpen(true)}
              onDeactivateSos={handleSosDeactivate}
              onRequestTransfer={(peerName, group, units) => {
                addToast('success', 'Transfer Requisition Transmitted', `Sent emergency transfer requisition for ${units} units of ${group} to ${peerName}.`);
              }}
            />
          )}

          {activePage === 'analytics' && <AnalyticsView />}

          {activePage === 'network' && (
            <NgoNetworkView
              peers={state.networkPeers}
              onRequestInterNgoTransfer={(peerName, group, units) => {
                addToast('success', 'Inter-NGO Transfer Dispatched', `Requisition sent to ${peerName} for ${units} units of ${group}.`);
              }}
            />
          )}

          {activePage === 'notifications' && (
            <NotificationsView
              notifications={state.notifications}
              onMarkRead={(id) => ngoStateService.markNotificationAsRead(id)}
              onMarkAllRead={() => {
                ngoStateService.markAllNotificationsAsRead();
                addToast('info', 'All Read', 'Marked all notifications as read.');
              }}
              onActionClick={(link) => navigateTo(link as ActiveNavPage)}
            />
          )}

          {activePage === 'activity' && <ActivityLogView activityLogs={state.activityLogs} />}

          {activePage === 'users' && (
            <UserStaffManagementView
              staffUsers={state.staffUsers}
              currentUser={state.currentUser}
              onSelectUser={(u) => {
                ngoStateService.setCurrentUser(u);
                addToast('info', 'Active Personnel Switched', `Now operating as ${u.name} (${u.role}).`);
              }}
            />
          )}

          {activePage === 'settings' && (
            <SettingsView
              profile={state.profile}
              inventory={state.inventory}
              onUpdateProfile={(p) => {
                ngoStateService.updateProfile(p);
                addToast('success', 'Profile Updated', 'Organization profile changes saved.');
              }}
              onUpdateThreshold={(group, val) => {
                ngoStateService.updateThreshold(group, val);
                addToast('info', 'Threshold Updated', `${group} minimum safety threshold updated to ${val} units.`);
              }}
              onResetDemoData={() => {
                ngoStateService.resetToDemoData();
                addToast('info', 'Reset Complete', 'Prototype data reset to baseline demonstration dataset.');
              }}
            />
          )}
        </div>
      </main>

      {/* GLOBAL MODALS */}
      <BarcodeScannerModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onConfirmAdd={handleBarcodeAddConfirm}
      />

      <ManualUpdateModal
        isOpen={isManualModalOpen}
        initialGroup={manualInitialGroup}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={handleManualAdjustment}
      />

      <EmergencySosModal
        isOpen={isSosModalOpen}
        hospitals={state.hospitals}
        onClose={() => setIsSosModalOpen(false)}
        onActivate={handleSosActivate}
      />

      <BloodUnitTimelineModal
        unit={selectedTimelineUnit}
        onClose={() => setSelectedTimelineUnit(null)}
      />

      {/* Floating Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
};
