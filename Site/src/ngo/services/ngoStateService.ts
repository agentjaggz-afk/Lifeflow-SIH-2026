import {
  BloodGroup,
  BloodInventoryItem,
  BloodUnit,
  ConnectedHospital,
  HospitalRequest,
  Shipment,
  ShipmentStatus,
  SosAlert,
  ActivityLog,
  AppNotification,
  NgoProfile,
  NgoNetworkPeer,
  StaffUser,
  RequestPriority
} from '../types';
import {
  INITIAL_INVENTORY,
  INITIAL_PROFILE,
  INITIAL_SOS_ALERT,
  INITIAL_HOSPITALS,
  INITIAL_REQUESTS,
  INITIAL_SHIPMENTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_NGO_NETWORK,
  INITIAL_STAFF,
  generateInitialBloodUnits
} from './mockData';
import { getRegionalCenter } from './regionalConfig';

const STORAGE_KEY = 'lifeflow_ngo_management_state_v2';

export interface NgoPlatformState {
  profile: NgoProfile;
  inventory: BloodInventoryItem[];
  bloodUnits: BloodUnit[];
  hospitals: ConnectedHospital[];
  requests: HospitalRequest[];
  shipments: Shipment[];
  sosAlert: SosAlert;
  activityLogs: ActivityLog[];
  notifications: AppNotification[];
  networkPeers: NgoNetworkPeer[];
  staffUsers: StaffUser[];
  currentUser: StaffUser;
  lastSyncTimestamp: string;
}

type Listener = () => void;

class NgoStateService {
  private state: NgoPlatformState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = this.loadState();
    this.syncWithGlobalAuth();
  }

  private loadState(): NgoPlatformState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Verify core arrays exist
          if (parsed && Array.isArray(parsed.inventory) && Array.isArray(parsed.bloodUnits)) {
            // Count distribution across cases: Green (>150), Yellow (100-150), Red (<100)
            const greenCount = parsed.inventory.filter((i: BloodInventoryItem) => i.currentUnits > 150).length;
            const yellowCount = parsed.inventory.filter((i: BloodInventoryItem) => i.currentUnits >= 100 && i.currentUnits <= 150).length;
            const redCount = parsed.inventory.filter((i: BloodInventoryItem) => i.currentUnits < 100).length;

            // If cached inventory does not have at least 2 blood types in each case, synchronize with INITIAL_INVENTORY
            if (greenCount < 2 || yellowCount < 2 || redCount < 2) {
              parsed.inventory.forEach((item: BloodInventoryItem) => {
                const init = INITIAL_INVENTORY.find((i) => i.bloodGroup === item.bloodGroup);
                if (init) {
                  item.currentUnits = init.currentUnits;
                  item.maxCapacity = init.maxCapacity;
                  item.minThreshold = init.minThreshold;
                }
              });
            }

            // Re-evaluate inventory statuses based on threshold rules: <100 Red (Critical), 100-150 Yellow (Approaching), >150 Green (Healthy)
            parsed.inventory.forEach((item: BloodInventoryItem) => {
              item.status = this.recalculateGroupStatus(item);
            });
            // Sanitize any legacy cached Delhi data
          if (
            parsed.profile &&
            (parsed.profile.name?.includes('Delhi') ||
              parsed.profile.city?.includes('Delhi') ||
              parsed.profile.licenseNumber?.includes('DL'))
          ) {
            parsed.profile = { ...INITIAL_PROFILE };
          }
          if (parsed.currentUser && parsed.currentUser.name === 'Rahul Sharma') {
            parsed.currentUser.name = 'Rahul Mohanty';
            parsed.currentUser.email = 'rahul.m@odisharedcrossblood.org';
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse existing NGO state, using fresh demo state', e);
    }

    return this.createDefaultState();
  }

  private createDefaultState(): NgoPlatformState {
    return {
      profile: { ...INITIAL_PROFILE },
      inventory: JSON.parse(JSON.stringify(INITIAL_INVENTORY)),
      bloodUnits: generateInitialBloodUnits(),
      hospitals: JSON.parse(JSON.stringify(INITIAL_HOSPITALS)),
      requests: JSON.parse(JSON.stringify(INITIAL_REQUESTS)),
      shipments: JSON.parse(JSON.stringify(INITIAL_SHIPMENTS)),
      sosAlert: { ...INITIAL_SOS_ALERT },
      activityLogs: JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOGS)),
      notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
      networkPeers: JSON.parse(JSON.stringify(INITIAL_NGO_NETWORK)),
      staffUsers: JSON.parse(JSON.stringify(INITIAL_STAFF)),
      currentUser: INITIAL_STAFF[1], // Rahul Mohanty (Inventory Manager)
      lastSyncTimestamp: new Date().toISOString()
    };
  }

  private saveState() {
    try {
      this.state.lastSyncTimestamp = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      // Cross-sync session parameters
      localStorage.setItem('bloodlinkUserName', this.state.profile.name);
      localStorage.setItem('bloodlinkUserRole', 'ngo');
      localStorage.setItem('bloodlinkUserLicense', this.state.profile.licenseNumber);
      localStorage.setItem('lifeflow_user_role', 'ngo');
      localStorage.setItem('lifeflow_user_name', this.state.profile.name);
    } catch (e) {
      console.error('Error saving NGO state to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Listener callback error', err);
      }
    });
  }

  // Sync if username was stored from main page login
  private syncWithGlobalAuth() {
    const savedName = localStorage.getItem('bloodlinkUserName');
    if (savedName && savedName !== 'LifeFlow User' && !savedName.includes('Delhi') && savedName.length > 2) {
      this.state.profile.name = savedName;
    }
  }

  /**
   * Reconfigure state according to a selected Odisha regional center
   */
  public setRegionalCenter(region: string) {
    const center = getRegionalCenter(region);
    this.state.profile.name = center.facilityName;
    this.state.profile.city = center.city;
    this.state.profile.state = center.state;
    this.state.profile.address = center.hubAddress;
    this.state.profile.licenseNumber = center.facilityLicense;
    this.state.profile.adminName = center.adminName;
    this.state.profile.emergencyHotline = center.emergencyHotline;

    if (this.state.currentUser.role === 'Inventory Manager') {
      this.state.currentUser.name = center.inventoryManager;
    } else if (this.state.currentUser.role === 'NGO Administrator') {
      this.state.currentUser.name = center.adminName;
    } else if (this.state.currentUser.role === 'Dispatch Manager') {
      this.state.currentUser.name = center.dispatchManager;
    }

    this.saveState();
  }

  // Getters
  public getState(): Readonly<NgoPlatformState> {
    return this.state;
  }

  public getProfile(): NgoProfile {
    return this.state.profile;
  }

  public getInventory(): BloodInventoryItem[] {
    return this.state.inventory;
  }

  public getBloodUnits(): BloodUnit[] {
    return this.state.bloodUnits;
  }

  public getHospitals(): ConnectedHospital[] {
    return this.state.hospitals;
  }

  public getRequests(): HospitalRequest[] {
    return this.state.requests;
  }

  public getShipments(): Shipment[] {
    return this.state.shipments;
  }

  public getSosAlert(): SosAlert {
    return this.state.sosAlert;
  }

  public getActivityLogs(): ActivityLog[] {
    return this.state.activityLogs;
  }

  public getNotifications(): AppNotification[] {
    return this.state.notifications;
  }

  public getNetworkPeers(): NgoNetworkPeer[] {
    return this.state.networkPeers;
  }

  public getStaffUsers(): StaffUser[] {
    return this.state.staffUsers;
  }

  public getCurrentUser(): StaffUser {
    return this.state.currentUser;
  }

  public setCurrentUser(user: StaffUser) {
    this.state.currentUser = user;
    this.saveState();
  }

  // Re-calculate inventory status helper: <100 is Critical (Red), 100-150 is Approaching (Yellow), >150 is Healthy (Green)
  private recalculateGroupStatus(item: BloodInventoryItem): 'Healthy' | 'Approaching' | 'Critical' {
    if (item.currentUnits < 100) {
      return 'Critical';
    } else if (item.currentUnits <= 150) {
      return 'Approaching';
    }
    return 'Healthy';
  }

  // BARCODE ADD BLOOD UNIT
  public addBloodUnit(unit: BloodUnit, staffName?: string): { success: boolean; message: string } {
    // Duplicate check
    const existing = this.state.bloodUnits.find((u) => u.id.trim().toUpperCase() === unit.id.trim().toUpperCase());
    if (existing) {
      return {
        success: false,
        message: `Duplicate detected: Unit ID ${unit.id} is already registered in inventory!`
      };
    }

    const performer = staffName || this.state.currentUser.name;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Prepend to blood units
    const enhancedUnit: BloodUnit = {
      ...unit,
      lastUpdated: 'Just now',
      lifecycle: [
        {
          timestamp: `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${timeStr}`,
          action: 'Barcode Scanned & Unit Registered into Cold Chain',
          performedBy: performer,
          location: unit.storageLocation,
          notes: 'Auto-verified with ISBT-128 compliance'
        },
        ...(unit.lifecycle || [])
      ]
    };

    this.state.bloodUnits.unshift(enhancedUnit);

    // Update inventory group stock
    const invItem = this.state.inventory.find((i) => i.bloodGroup === unit.bloodGroup);
    if (invItem) {
      invItem.currentUnits += 1;
      invItem.lastUpdated = 'Just now';
      invItem.status = this.recalculateGroupStatus(invItem);
    }

    // Add activity log
    this.state.activityLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      action: `Blood Unit ${unit.id} added`,
      bloodGroup: unit.bloodGroup,
      quantity: 1,
      user: performer,
      details: `${unit.component} barcoded into ${unit.storageLocation}`,
      type: 'add'
    });

    // Add notification
    this.state.notifications.unshift({
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: 'Blood Unit Added',
      message: `New ${unit.bloodGroup} unit (${unit.id}) successfully scanned and stored in ${unit.storageLocation}.`,
      timestamp: 'Just now',
      read: false,
      category: 'Inventory',
      urgency: 'low',
      actionLink: 'blood-units'
    });

    this.saveState();
    return {
      success: true,
      message: `Blood Unit ${unit.id} (${unit.bloodGroup}) successfully added to inventory!`
    };
  }

  // MANUAL INVENTORY UPDATE
  public manualInventoryUpdate(params: {
    action: 'add' | 'remove' | 'correct' | 'expired' | 'damaged' | 'reserved' | 'dispatched';
    bloodGroup: BloodGroup;
    quantity: number;
    reason: string;
    destination?: string;
    storageLocation?: string;
    staffName?: string;
  }): { success: boolean; message: string } {
    const { action, bloodGroup, quantity, reason, destination, staffName } = params;
    const performer = staffName || this.state.currentUser.name;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const invItem = this.state.inventory.find((i) => i.bloodGroup === bloodGroup);
    if (!invItem) {
      return { success: false, message: `Blood group ${bloodGroup} not recognized.` };
    }

    const isAdding = action === 'add';
    const delta = isAdding ? quantity : -Math.abs(quantity);

    if (!isAdding && invItem.currentUnits + delta < 0) {
      return {
        success: false,
        message: `Insufficient stock! Cannot deduct ${quantity} units from ${invItem.currentUnits} available.`
      };
    }

    const previousCount = invItem.currentUnits;
    invItem.currentUnits += delta;
    invItem.lastUpdated = 'Just now';
    invItem.status = this.recalculateGroupStatus(invItem);

    // If stock crossed threshold downwards (<100), trigger low-stock alert!
    const droppedBelowThreshold = previousCount >= 100 && invItem.currentUnits < 100;

    if (droppedBelowThreshold) {
      this.state.notifications.unshift({
        id: `NOTIF-CRIT-${Date.now().toString().slice(-4)}`,
        title: `CRITICAL: ${bloodGroup} Low Stock Alert`,
        message: `${bloodGroup} inventory has dropped below the 100-unit critical threshold (${invItem.currentUnits} units). Recommend requesting donor drives or activating SOS.`,
        timestamp: 'Just now',
        read: false,
        category: 'Emergency',
        urgency: 'critical',
        actionLink: 'emergency'
      });
    }

    // Activity Log
    this.state.activityLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      action: `Inventory manually adjusted (${action.toUpperCase()})`,
      bloodGroup: bloodGroup,
      quantity: delta,
      user: performer,
      details: `Reason: ${reason}${destination ? ` • Destination: ${destination}` : ''}`,
      type: isAdding ? 'add' : (action === 'dispatched' ? 'dispatch' : 'remove')
    });

    this.saveState();
    return {
      success: true,
      message: `${bloodGroup} inventory updated: ${previousCount} → ${invItem.currentUnits} units (${delta > 0 ? `+${delta}` : delta}).`
    };
  }

  // UPDATE THRESHOLD
  public updateThreshold(bloodGroup: BloodGroup, newThreshold: number) {
    const inv = this.state.inventory.find((i) => i.bloodGroup === bloodGroup);
    if (inv) {
      inv.minThreshold = Math.max(1, newThreshold);
      inv.status = this.recalculateGroupStatus(inv);
      this.saveState();
    }
  }

  // SOS EMERGENCY ACTIVATION
  public activateSos(params: {
    bloodGroup: BloodGroup;
    requiredUnits: number;
    hospitalName: string;
    requiredBy: string;
    message: string;
    broadcastRadiusKm?: number;
    staffName?: string;
  }) {
    const { bloodGroup, requiredUnits, hospitalName, requiredBy, message, staffName } = params;
    const inv = this.state.inventory.find((i) => i.bloodGroup === bloodGroup);
    const available = inv ? inv.currentUnits : 0;
    const shortage = Math.max(0, requiredUnits - available);
    const performer = staffName || this.state.currentUser.name;

    this.state.sosAlert = {
      id: `SOS-${Date.now().toString().slice(-4)}`,
      isActive: true,
      bloodGroup,
      requiredUnits,
      availableUnits: available,
      shortageUnits: shortage,
      hospitalName,
      requiredBy,
      message,
      activatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      activatedBy: performer,
      notifiedHospitals: this.state.hospitals.length,
      notifiedNgos: this.state.networkPeers.length
    };

    this.state.profile.isEmergencyMode = true;

    // Mark target hospital status as Emergency
    const targetHosp = this.state.hospitals.find((h) => h.name.toLowerCase().includes(hospitalName.toLowerCase()));
    if (targetHosp) {
      targetHosp.connectionStatus = 'Emergency';
    }

    // Add critical notification
    this.state.notifications.unshift({
      id: `NOTIF-SOS-${Date.now().toString().slice(-4)}`,
      title: '🚨 EMERGENCY SOS BROADCAST ACTIVATED',
      message: `Critical shortage for ${bloodGroup} (${shortage} units shortage for ${hospitalName}). Broadcast dispatched to all connected facilities.`,
      timestamp: 'Just now',
      read: false,
      category: 'Emergency',
      urgency: 'critical',
      actionLink: 'emergency'
    });

    // Activity Log
    this.state.activityLogs.unshift({
      id: `LOG-SOS-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: '🚨 EMERGENCY SOS ALERT ACTIVATED',
      bloodGroup,
      quantity: requiredUnits,
      user: performer,
      details: `Broadcast sent to ${this.state.hospitals.length} hospitals & ${this.state.networkPeers.length} NGOs for ${hospitalName}`,
      type: 'sos'
    });

    this.saveState();
  }

  // SOS DEACTIVATION
  public deactivateSos(staffName?: string) {
    this.state.sosAlert.isActive = false;
    this.state.profile.isEmergencyMode = false;

    this.state.activityLogs.unshift({
      id: `LOG-SOS-OFF-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: 'Emergency SOS Alert Deactivated / Resolved',
      user: staffName || this.state.currentUser.name,
      details: 'Critical stock replenished and emergency protocol stood down.',
      type: 'sos'
    });

    this.saveState();
  }

  // ACCEPT HOSPITAL REQUEST
  public acceptRequest(requestId: string, staffName?: string) {
    const req = this.state.requests.find((r) => r.id === requestId);
    if (req) {
      req.status = 'Accepted';
      this.state.activityLogs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: `Requisition ${requestId} Accepted`,
        bloodGroup: req.bloodGroup,
        quantity: req.requiredUnits,
        user: staffName || this.state.currentUser.name,
        details: `Approved for ${req.hospitalName}. Preparing dispatch cold chain.`,
        type: 'update'
      });
      this.saveState();
    }
  }

  // REJECT HOSPITAL REQUEST
  public rejectRequest(requestId: string, reason: string, staffName?: string) {
    const req = this.state.requests.find((r) => r.id === requestId);
    if (req) {
      req.status = 'Rejected';
      this.state.activityLogs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: `Requisition ${requestId} Rejected`,
        bloodGroup: req.bloodGroup,
        user: staffName || this.state.currentUser.name,
        details: `Reason: ${reason}`,
        type: 'update'
      });
      this.saveState();
    }
  }

  // CREATE SHIPMENT
  public createShipment(params: {
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
    staffName?: string;
  }): Shipment {
    const {
      requestId,
      hospitalId,
      hospitalName,
      destination,
      bloodGroup,
      units,
      unitIds,
      courier,
      driverName,
      driverContact,
      vehicleNumber,
      staffName
    } = params;

    const performer = staffName || this.state.currentUser.name;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const shipmentId = `SHP-${(1034 + this.state.shipments.length).toString()}`;

    // Deduct stock from inventory
    const invItem = this.state.inventory.find((i) => i.bloodGroup === bloodGroup);
    if (invItem) {
      invItem.currentUnits = Math.max(0, invItem.currentUnits - units);
      invItem.lastUpdated = 'Just now';
      invItem.status = this.recalculateGroupStatus(invItem);
    }

    // Mark matched blood units as Dispatched
    unitIds.forEach((uid) => {
      const u = this.state.bloodUnits.find((unit) => unit.id === uid);
      if (u) {
        u.status = 'Dispatched';
        u.destinationHospital = hospitalName;
        u.shipmentId = shipmentId;
        u.lastUpdated = 'Just now';
        u.lifecycle.unshift({
          timestamp: `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${timeStr}`,
          action: `Dispatched in Shipment ${shipmentId}`,
          performedBy: performer,
          location: 'Cold Van Courier',
          notes: `Assigned to driver ${driverName} (${vehicleNumber}) for ${hospitalName}`
        });
      }
    });

    // Update request status if linked
    if (requestId) {
      const req = this.state.requests.find((r) => r.id === requestId);
      if (req) {
        req.status = 'Dispatched';
      }
    }

    const newShipment: Shipment = {
      id: shipmentId,
      requestId,
      hospitalId,
      hospitalName,
      destination,
      origin: this.state.profile.name + ' Central Depot',
      bloodGroup,
      units,
      unitIds,
      courier,
      driverName,
      driverContact,
      vehicleNumber,
      estimatedArrival: 'In approx 25-35 mins',
      distanceRemainingKm: 6.5,
      currentLocationName: 'Dispatched from Hub Dock Gate 1',
      status: 'In Transit',
      routeProgress: 15,
      timeline: [
        { time: timeStr, status: 'Shipment Created', note: `${units} units of ${bloodGroup} sealed in temperature logger crate` },
        { time: timeStr, status: 'Assigned to Driver', note: `Driver ${driverName} verified custody` },
        { time: timeStr, status: 'In Transit', note: 'Departed facility onto route' }
      ],
      createdAt: `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${timeStr}`
    };

    this.state.shipments.unshift(newShipment);

    // Activity Log
    this.state.activityLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      action: `Shipment ${shipmentId} created`,
      bloodGroup,
      quantity: units,
      user: performer,
      details: `${units} units ${bloodGroup} sent to ${hospitalName} via ${driverName}`,
      type: 'dispatch'
    });

    // Notification
    this.state.notifications.unshift({
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: 'Shipment Dispatched',
      message: `Shipment ${shipmentId} containing ${units} units of ${bloodGroup} is en route to ${hospitalName}.`,
      timestamp: 'Just now',
      read: false,
      category: 'Shipments',
      urgency: 'medium',
      actionLink: 'shipments'
    });

    this.saveState();
    return newShipment;
  }

  // UPDATE SHIPMENT STATUS
  public updateShipmentStatus(shipmentId: string, status: ShipmentStatus, progressPercent?: number) {
    const shp = this.state.shipments.find((s) => s.id === shipmentId);
    if (!shp) return;

    shp.status = status;
    if (progressPercent !== undefined) {
      shp.routeProgress = progressPercent;
    }
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let note = `Status updated to ${status}`;
    if (status === 'Delivered') {
      shp.routeProgress = 100;
      shp.distanceRemainingKm = 0;
      shp.currentLocationName = 'Delivered at Hospital Transfusion Ward';
      note = 'Delivered and custody transferred to hospital staff';
      
      // Update linked units to Delivered
      shp.unitIds.forEach((uid) => {
        const u = this.state.bloodUnits.find((unit) => unit.id === uid);
        if (u) {
          u.status = 'Delivered';
          u.lifecycle.unshift({
            timestamp: `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${timeStr}`,
            action: 'Delivery Verified at Hospital Ward',
            performedBy: 'Logistics Partner',
            location: shp.destination
          });
        }
      });
    }

    shp.timeline.unshift({ time: timeStr, status, note });
    this.saveState();
  }

  // PRIORITIZE EXPIRING UNIT FOR DISPATCH
  public prioritizeUnitForDispatch(unitId: string, staffName?: string) {
    const u = this.state.bloodUnits.find((unit) => unit.id === unitId);
    if (u) {
      u.status = 'Reserved';
      u.storageLocation = `${u.storageLocation} [PRIORITY DISPATCH]`;
      u.lifecycle.unshift({
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: 'Prioritized for Emergency Hospital Dispatch (Close Expiry)',
        performedBy: staffName || this.state.currentUser.name
      });
      this.state.activityLogs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: `Unit ${unitId} prioritized for dispatch`,
        bloodGroup: u.bloodGroup,
        user: staffName || this.state.currentUser.name,
        details: `Tagged for priority outbound dispatch due to upcoming expiry`,
        type: 'update'
      });
      this.saveState();
    }
  }

  // NOTIFICATION ACTIONS
  public markNotificationAsRead(id: string) {
    const n = this.state.notifications.find((notif) => notif.id === id);
    if (n) {
      n.read = true;
      this.saveState();
    }
  }

  public markAllNotificationsAsRead() {
    this.state.notifications.forEach((n) => (n.read = true));
    this.saveState();
  }

  // UPDATE PROFILE
  public updateProfile(profile: Partial<NgoProfile>) {
    this.state.profile = { ...this.state.profile, ...profile };
    this.saveState();
  }

  // RESET TO DEMO DATA
  public resetToDemoData() {
    this.state = this.createDefaultState();
    this.saveState();
  }
}

export const ngoStateService = new NgoStateService();
