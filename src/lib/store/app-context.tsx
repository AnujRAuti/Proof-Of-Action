'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EvidenceItem, Project, AuditEvent, MOCK_EVIDENCE_ITEMS, MOCK_PROJECTS, MOCK_AUDIT_EVENTS } from '../data/mock-dataset';

export type UserRole = 'CITIZEN' | 'SUPERVISOR' | 'REVIEWER' | 'PROGRAM_ADMIN' | 'AUDITOR' | 'API_CLIENT';
export type TableDensity = 'comfortable' | 'compact';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  district: string;
  state: string;
  pincode?: string;
  isAadhaarVerified?: boolean;
  department?: string;
}

export interface CitizenComplaint {
  id: string;
  trackingId: string;
  projectId: string;
  projectName: string;
  category: string;
  description: string;
  voiceNoteUrl?: string;
  photoUrl?: string;
  status: 'RECEIVED' | 'IN_REVIEW' | 'RESOLVED';
  statusLabel: string;
  filedAt: string;
  updatedAt: string;
  departmentResponse?: string;
  filedBy: string;
  isVerifiedCitizen?: boolean;
}

export interface SupervisorTask {
  id: string;
  projectId: string;
  projectName: string;
  scheme: string;
  activityName: string;
  requiredStage: 'before' | 'during' | 'after';
  dueDate: string;
  distanceMeters: number;
  status: 'PENDING' | 'ACCEPTED' | 'NEEDS_RETAKE';
  reviewerNote?: string;
  sampleLocation: { lat: number; lng: number };
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'info' | 'warning';
  undoAction?: () => void;
  undoLabel?: string;
  timestamp: number;
}

export type AuthStatus = 'AUTH_LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'AUTH_ERROR';

interface AppContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  authStatus: AuthStatus;
  setRole: (role: UserRole) => void;
  setAuthenticatedUser: (user: UserProfile) => void;
  loginUser: (role: UserRole, customUser?: Partial<UserProfile>) => void;
  logoutUser: () => Promise<void>;
  syncSession: () => Promise<UserProfile | null>;
  evidenceList: EvidenceItem[];
  projects: Project[];
  auditEvents: AuditEvent[];
  complaints: CitizenComplaint[];
  fileComplaint: (complaint: Omit<CitizenComplaint, 'id' | 'trackingId' | 'filedAt' | 'updatedAt' | 'status' | 'statusLabel'>) => CitizenComplaint;
  supervisorTasks: SupervisorTask[];
  density: TableDensity;
  setDensity: (density: TableDensity) => void;
  selectedEvidenceIds: string[];
  setSelectedEvidenceIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelectEvidence: (id: string) => void;
  selectAllEvidence: (ids: string[]) => void;
  clearSelection: () => void;
  approveEvidence: (id: string, note?: string) => void;
  rejectEvidence: (id: string, reason: string) => void;
  flagEvidence: (id: string, reason: string) => void;
  overrideEvidence: (id: string, newScore: number, newRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', mandatoryReason: string) => void;
  batchApprove: (ids: string[]) => void;
  batchFlag: (ids: string[]) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isShortcutsModalOpen: boolean;
  setIsShortcutsModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  user: 'eiil_current_user',
  evidence: 'eiil_evidence_list',
  auditEvents: 'eiil_audit_events',
  complaints: 'eiil_complaints',
  supervisorTasks: 'eiil_supervisor_tasks',
  density: 'eiil_table_density',
} as const;

// Initial Mock Datasets for 3 Roles
const INITIAL_CITIZEN_COMPLAINTS: CitizenComplaint[] = [
  {
    id: 'CMP-1029',
    trackingId: 'GRV-2026-881',
    projectId: 'PRJ-PMGSY-MH-401',
    projectName: 'Purandar Taluka Rural Bitumen Road Reconstruction',
    category: 'Pavement Quality & Drainage',
    description: 'Road wearing coat was completed nicely, but rain drain on the left side near village school is blocked by construction gravel.',
    status: 'IN_REVIEW',
    statusLabel: 'Being Looked Into (जांच जारी)',
    filedAt: '2026-08-25T11:20:00+05:30',
    updatedAt: '2026-08-26T14:10:00+05:30',
    departmentResponse: 'Junior Engineer visited site on 26 Aug. Contractor instructed to clear drainage by 29 Aug.',
    filedBy: 'Ramesh Sharma (Verified Resident)',
    isVerifiedCitizen: true,
  },
  {
    id: 'CMP-1030',
    trackingId: 'GRV-2026-742',
    projectId: 'PRJ-JJM-RJ-108',
    projectName: 'Har Ghar Jal Rural Piped Water Scheme',
    category: 'Water Pressure',
    description: 'Solar pump installed 4 days ago, but household tap flow in Ward 2 is very low in the morning hours.',
    status: 'RECEIVED',
    statusLabel: 'Received by Department (शिकायत प्राप्त हुई)',
    filedAt: '2026-08-27T09:15:00+05:30',
    updatedAt: '2026-08-27T09:15:00+05:30',
    filedBy: 'Sunita Devi',
    isVerifiedCitizen: false,
  },
];

const INITIAL_SUPERVISOR_TASKS: SupervisorTask[] = [
  {
    id: 'TSK-01',
    projectId: 'PRJ-PMGSY-MH-401',
    projectName: 'Purandar Taluka Rural Bitumen Road (Km 0 to 4.2)',
    scheme: 'PMGSY (Rural Roads)',
    activityName: 'Final Bituminous Wearing Coat & Edge Lines',
    requiredStage: 'after',
    dueDate: '2026-08-30',
    distanceMeters: 28,
    status: 'PENDING',
    sampleLocation: { lat: 18.2814, lng: 74.0156 },
  },
  {
    id: 'TSK-02',
    projectId: 'PRJ-JJM-RJ-108',
    projectName: 'Chaksu Solar Dual-Pump & Tap Scheme',
    scheme: 'Jal Jeevan Mission',
    activityName: 'Retake Live Photo: Pump Assembly & Panel Array',
    requiredStage: 'after',
    dueDate: '2026-08-29',
    distanceMeters: 62,
    status: 'NEEDS_RETAKE',
    reviewerNote: 'The location in this photo did not match the site — please retake a clear live photo on site today.',
    sampleLocation: { lat: 26.6025, lng: 75.9515 },
  },
  {
    id: 'TSK-03',
    projectId: 'PRJ-KUSUM-KA-204',
    projectName: 'Tiptur Feeder Level Solarization (500 kW)',
    scheme: 'PM-KUSUM (Solar)',
    activityName: 'Ground-Mounted Array & Earthing Pit',
    requiredStage: 'after',
    dueDate: '2026-09-02',
    distanceMeters: 485,
    status: 'PENDING',
    sampleLocation: { lat: 13.2612, lng: 76.4820 },
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Role & User Account State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [role, setRoleState] = useState<UserRole>('REVIEWER');
  const [authStatus, setAuthStatus] = useState<AuthStatus>('AUTH_LOADING');

  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(MOCK_EVIDENCE_ITEMS);
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(MOCK_AUDIT_EVENTS);
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(INITIAL_CITIZEN_COMPLAINTS);
  const [supervisorTasks, setSupervisorTasks] = useState<SupervisorTask[]>(INITIAL_SUPERVISOR_TASKS);

  const [density, setDensityState] = useState<TableDensity>('comfortable');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Sync session with backend /api/auth/me
  const syncSession = async (): Promise<UserProfile | null> => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          const userProfile: UserProfile = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            role: data.user.role,
            district: data.user.district,
            state: data.user.state,
            department: data.user.department,
            isAadhaarVerified: data.user.isAadhaarVerified,
          };
          setCurrentUser(userProfile);
          setRoleState(data.user.role);
          setAuthStatus('AUTHENTICATED');
          localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userProfile));
          return userProfile;
        }
      }
      setCurrentUser(null);
      setAuthStatus('UNAUTHENTICATED');
      localStorage.removeItem(STORAGE_KEYS.user);
      return null;
    } catch {
      setAuthStatus('UNAUTHENTICATED');
      return null;
    }
  };

  useEffect(() => {
    const readStoredValue = <T,>(key: string): T | null => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? (JSON.parse(saved) as T) : null;
      } catch {
        return null;
      }
    };

    const savedUser = readStoredValue<UserProfile>(STORAGE_KEYS.user);
    const savedEvidence = readStoredValue<EvidenceItem[]>(STORAGE_KEYS.evidence);
    const savedAuditEvents = readStoredValue<AuditEvent[]>(STORAGE_KEYS.auditEvents);
    const savedComplaints = readStoredValue<CitizenComplaint[]>(STORAGE_KEYS.complaints);
    const savedSupervisorTasks = readStoredValue<SupervisorTask[]>(STORAGE_KEYS.supervisorTasks);
    const savedDensity = localStorage.getItem(STORAGE_KEYS.density) as TableDensity | null;

    if (savedUser) {
      setCurrentUser(savedUser);
      setRoleState(savedUser.role);
    }
    if (savedEvidence) setEvidenceList(savedEvidence);
    if (savedAuditEvents) setAuditEvents(savedAuditEvents);
    if (savedComplaints) setComplaints(savedComplaints);
    if (savedSupervisorTasks) setSupervisorTasks(savedSupervisorTasks);
    if (savedDensity === 'comfortable' || savedDensity === 'compact') setDensityState(savedDensity);
    setHasHydrated(true);

    // Verify and hydrate authentic database session
    syncSession();
  }, []);

  // Prototype persistence keeps a presenter from losing a review decision when
  // the browser refreshes. This remains a client-side demo store, not a source
  // of truth for a production deployment.
  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(STORAGE_KEYS.evidence, JSON.stringify(evidenceList));
    localStorage.setItem(STORAGE_KEYS.auditEvents, JSON.stringify(auditEvents));
    localStorage.setItem(STORAGE_KEYS.complaints, JSON.stringify(complaints));
    localStorage.setItem(STORAGE_KEYS.supervisorTasks, JSON.stringify(supervisorTasks));
  }, [auditEvents, complaints, evidenceList, hasHydrated, supervisorTasks]);

  const setAuthenticatedUser = (user: UserProfile) => {
    setCurrentUser(user);
    setRoleState(user.role);
    setAuthStatus('AUTHENTICATED');
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  };

  const loginUser = (newRole: UserRole, customUser?: Partial<UserProfile>) => {
    const profile: UserProfile = {
      id: customUser?.id || (newRole === 'CITIZEN' ? 'USR-CITIZEN-01' : newRole === 'SUPERVISOR' ? 'USR-SUP-01' : 'USR-REV-01'),
      name: customUser?.name || (newRole === 'CITIZEN' ? 'Ramesh Sharma' : newRole === 'SUPERVISOR' ? 'Suresh Patil' : 'Rajesh Kulkarni'),
      role: newRole,
      email: customUser?.email,
      phone: customUser?.phone,
      district: customUser?.district || 'Pune',
      state: customUser?.state || 'Maharashtra',
      department: customUser?.department,
      isAadhaarVerified: customUser?.isAadhaarVerified,
      ...customUser,
    };

    setAuthenticatedUser(profile);

    addToast({
      title: `Welcome, ${profile.name}`,
      description: `Authenticated as ${newRole}. Accessing ${newRole.toLowerCase()} portal...`,
      type: 'success',
    });

    // Auto-redirect to role dashboard root
    if (newRole === 'CITIZEN') {
      router.push('/citizen');
    } else if (newRole === 'SUPERVISOR') {
      router.push('/supervisor');
    } else {
      router.push('/reviewer');
    }
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}

    setCurrentUser(null);
    setAuthStatus('UNAUTHENTICATED');
    localStorage.removeItem(STORAGE_KEYS.user);
    router.push('/login');
    addToast({
      title: 'Logged Out',
      description: 'Session ended safely.',
      type: 'info',
    });
  };

  const handleSetRole = (r: UserRole) => {
    loginUser(r);
  };

  const fileComplaint = (complaintData: Omit<CitizenComplaint, 'id' | 'trackingId' | 'filedAt' | 'updatedAt' | 'status' | 'statusLabel'>): CitizenComplaint => {
    const newComplaint: CitizenComplaint = {
      ...complaintData,
      id: `CMP-${Date.now().toString().slice(-4)}`,
      trackingId: `GRV-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'RECEIVED',
      statusLabel: 'Received by Department (शिकायत प्राप्त हुई)',
      filedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    addToast({
      title: 'Concern Filed Successfully',
      description: `Tracking ID: ${newComplaint.trackingId}. Updates will be posted on your complaint dashboard.`,
      type: 'success',
    });

    return newComplaint;
  };

  const setDensity = (newDensity: TableDensity) => {
    setDensityState(newDensity);
    localStorage.setItem(STORAGE_KEYS.density, newDensity);
  };

  const addAuditEvent = (
    item: EvidenceItem,
    action: AuditEvent['action'],
    newState: EvidenceItem['auditStatus'],
    reason: string
  ) => {
    const newAuditEvent: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 5)}`,
      evidenceId: item.id,
      projectId: item.projectId,
      actorName: currentUser?.name || 'Audit Officer',
      actorRole: role,
      action,
      previousState: item.auditStatus,
      newState,
      reason,
      sha256Hash: item.sha256,
      timestamp: new Date().toISOString(),
    };
    setAuditEvents((prev) => [newAuditEvent, ...prev]);
  };

  const addToast = (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = {
      ...toast,
      id,
      timestamp: Date.now(),
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSelectEvidence = (id: string) => {
    setSelectedEvidenceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllEvidence = (ids: string[]) => {
    setSelectedEvidenceIds(ids);
  };

  const clearSelection = () => {
    setSelectedEvidenceIds([]);
  };

  const approveEvidence = (id: string, note = 'Approved upon visual & geofence verification') => {
    const prevItem = evidenceList.find((e) => e.id === id);
    if (!prevItem) return;

    setEvidenceList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, auditStatus: 'APPROVED', reviewer: { ...e.reviewer, assignedTo: 'Current Reviewer', note, decisionDate: new Date().toISOString() } } : e))
    );

    addAuditEvent(prevItem, 'APPROVE', 'APPROVED', note);

    addToast({
      title: `Evidence ${id} Approved`,
      description: `Integrity status marked as APPROVED.`,
      type: 'success',
    });
  };

  const rejectEvidence = (id: string, reason: string) => {
    const prevItem = evidenceList.find((e) => e.id === id);
    if (!prevItem) return;

    setEvidenceList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, auditStatus: 'REJECTED', reviewer: { ...e.reviewer, assignedTo: 'Current Reviewer', note: reason, decisionDate: new Date().toISOString() } } : e))
    );
    addAuditEvent(prevItem, 'REJECT', 'REJECTED', reason);

    addToast({
      title: `Evidence ${id} Rejected`,
      description: `Rejection notice dispatched to supervisor.`,
      type: 'error',
    });
  };

  const flagEvidence = (id: string, reason: string) => {
    const prevItem = evidenceList.find((e) => e.id === id);
    if (!prevItem) return;

    setEvidenceList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, auditStatus: 'FLAGGED', reviewer: { ...e.reviewer, assignedTo: 'Current Reviewer', note: reason, decisionDate: new Date().toISOString() } } : e))
    );
    addAuditEvent(prevItem, 'INSPECTION_REQUESTED', 'FLAGGED', reason);

    addToast({
      title: `Evidence ${id} Flagged`,
      description: `Action task assigned to Field Officer.`,
      type: 'warning',
    });
  };

  const overrideEvidence = (id: string, newScore: number, newRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', mandatoryReason: string) => {
    const prevItem = evidenceList.find((e) => e.id === id);
    if (!prevItem) return;

    setEvidenceList((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              integrityScore: newScore,
              riskLevel: newRisk,
              auditStatus: 'OVERRIDDEN',
              reviewer: {
                ...e.reviewer,
                assignedTo: currentUser?.name || 'Lead Reviewer',
                overrideReason: mandatoryReason,
                decisionDate: new Date().toISOString(),
              },
            }
          : e
      )
    );
    addAuditEvent(prevItem, 'OVERRIDE', 'OVERRIDDEN', mandatoryReason);

    addToast({
      title: `AI Finding Overridden for ${id}`,
      description: `Integrity score updated to ${newScore}.`,
      type: 'info',
    });
  };

  const batchApprove = (ids: string[]) => {
    const affectedItems = evidenceList.filter((item) => ids.includes(item.id));
    setEvidenceList((prev) =>
      prev.map((e) => (ids.includes(e.id) ? { ...e, auditStatus: 'APPROVED' } : e))
    );
    affectedItems.forEach((item) =>
      addAuditEvent(item, 'APPROVE', 'APPROVED', 'Approved through bulk review action')
    );
    clearSelection();
    addToast({
      title: `Bulk Action Completed`,
      description: `${ids.length} evidence items approved.`,
      type: 'success',
    });
  };

  const batchFlag = (ids: string[]) => {
    const affectedItems = evidenceList.filter((item) => ids.includes(item.id));
    setEvidenceList((prev) =>
      prev.map((e) => (ids.includes(e.id) ? { ...e, auditStatus: 'FLAGGED' } : e))
    );
    affectedItems.forEach((item) =>
      addAuditEvent(item, 'INSPECTION_REQUESTED', 'FLAGGED', 'Flagged through bulk review action')
    );
    clearSelection();
    addToast({
      title: `Bulk Action Completed`,
      description: `${ids.length} evidence items flagged for physical inspection.`,
      type: 'warning',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        authStatus,
        setRole: handleSetRole,
        setAuthenticatedUser,
        loginUser,
        logoutUser,
        syncSession,
        evidenceList,
        projects,
        auditEvents,
        complaints,
        fileComplaint,
        supervisorTasks,
        density,
        setDensity,
        selectedEvidenceIds,
        setSelectedEvidenceIds,
        toggleSelectEvidence,
        selectAllEvidence,
        clearSelection,
        approveEvidence,
        rejectEvidence,
        flagEvidence,
        overrideEvidence,
        batchApprove,
        batchFlag,
        toasts,
        addToast,
        removeToast,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isShortcutsModalOpen,
        setIsShortcutsModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
