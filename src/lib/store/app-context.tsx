'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EvidenceItem, Project, AuditEvent, MOCK_EVIDENCE_ITEMS, MOCK_PROJECTS, MOCK_AUDIT_EVENTS } from '../data/mock-dataset';

export type UserRole = 'PROGRAM_ADMIN' | 'REVIEWER' | 'FIELD_OFFICER' | 'AUDITOR' | 'API_CLIENT';
export type TableDensity = 'comfortable' | 'compact';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'info' | 'warning';
  undoAction?: () => void;
  undoLabel?: string;
  timestamp: number;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  evidenceList: EvidenceItem[];
  projects: Project[];
  auditEvents: AuditEvent[];
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('REVIEWER');
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(MOCK_EVIDENCE_ITEMS);
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(MOCK_AUDIT_EVENTS);
  const [density, setDensityState] = useState<TableDensity>('comfortable');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  useEffect(() => {
    const savedDensity = localStorage.getItem('eiil_table_density') as TableDensity | null;
    if (savedDensity) {
      setDensityState(savedDensity);
    }
    const savedRole = localStorage.getItem('eiil_active_role') as UserRole | null;
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  // Global Keyboard Shortcuts (Cmd/Ctrl+K for palette, ? for shortcuts modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsShortcutsModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setDensity = (newDensity: TableDensity) => {
    setDensityState(newDensity);
    localStorage.setItem('eiil_table_density', newDensity);
  };

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('eiil_active_role', newRole);
    addToast({
      title: `Active Persona Switched`,
      description: `Now operating with permissions of ${newRole.replace('_', ' ')}.`,
      type: 'info',
    });
  };

  const addToast = (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = {
      ...toast,
      id,
      timestamp: Date.now(),
    };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleSelectEvidence = (id: string) => {
    setSelectedEvidenceIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllEvidence = (ids: string[]) => {
    setSelectedEvidenceIds(ids);
  };

  const clearSelection = () => {
    setSelectedEvidenceIds([]);
  };

  const approveEvidence = (id: string, note = 'Approved upon visual & geofence verification') => {
    const prevItem = evidenceList.find(e => e.id === id);
    if (!prevItem) return;

    setEvidenceList(prev =>
      prev.map(e => (e.id === id ? { ...e, auditStatus: 'APPROVED', reviewer: { ...e.reviewer, assignedTo: 'Current Reviewer', note, decisionDate: new Date().toISOString() } } : e))
    );

    const newAuditEvent: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      evidenceId: id,
      projectId: prevItem.projectId,
      actorName: 'Audit Officer (Active Session)',
      actorRole: role,
      action: 'APPROVE',
      previousState: prevItem.auditStatus,
      newState: 'APPROVED',
      reason: note,
      sha256Hash: prevItem.sha256,
      timestamp: new Date().toISOString(),
    };
    setAuditEvents(prev => [newAuditEvent, ...prev]);

    addToast({
      title: `Evidence ${id} Approved`,
      description: `Integrity status marked as APPROVED. Audit trail updated.`,
      type: 'success',
      undoLabel: 'Undo Approval',
      undoAction: () => {
        setEvidenceList(prev =>
          prev.map(e => (e.id === id ? { ...e, auditStatus: prevItem.auditStatus } : e))
        );
        addToast({
          title: `Approval Reverted`,
          description: `Evidence ${id} restored to ${prevItem.auditStatus}.`,
          type: 'info',
        });
      },
    });
  };

  const rejectEvidence = (id: string, reason: string) => {
    const prevItem = evidenceList.find(e => e.id === id);
    if (!prevItem) return;

    setEvidenceList(prev =>
      prev.map(e => (e.id === id ? { ...e, auditStatus: 'REJECTED', reviewer: { ...e.reviewer, assignedTo: 'Current Reviewer', note: reason, decisionDate: new Date().toISOString() } } : e))
    );

    const newAuditEvent: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      evidenceId: id,
      projectId: prevItem.projectId,
      actorName: 'Audit Officer (Active Session)',
      actorRole: role,
      action: 'REJECT',
      previousState: prevItem.auditStatus,
      newState: 'REJECTED',
      reason: reason || 'Evidence rejected due to multi-signal inconsistency.',
      sha256Hash: prevItem.sha256,
      timestamp: new Date().toISOString(),
    };
    setAuditEvents(prev => [newAuditEvent, ...prev]);

    addToast({
      title: `Evidence ${id} Rejected`,
      description: `Rejection notice dispatched.`,
      type: 'error',
    });
  };

  const flagEvidence = (id: string, reason: string) => {
    const prevItem = evidenceList.find(e => e.id === id);
    if (!prevItem) return;

    setEvidenceList(prev =>
      prev.map(e => (e.id === id ? { ...e, auditStatus: 'FLAGGED', reviewer: { ...e.reviewer, assignedTo: 'Current Reviewer', note: reason, decisionDate: new Date().toISOString() } } : e))
    );

    const newAuditEvent: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      evidenceId: id,
      projectId: prevItem.projectId,
      actorName: 'Audit Officer (Active Session)',
      actorRole: role,
      action: 'INSPECTION_REQUESTED',
      previousState: prevItem.auditStatus,
      newState: 'FLAGGED',
      reason: reason || 'Flagged for on-site physical field audit.',
      sha256Hash: prevItem.sha256,
      timestamp: new Date().toISOString(),
    };
    setAuditEvents(prev => [newAuditEvent, ...prev]);

    addToast({
      title: `Evidence ${id} Flagged`,
      description: `Dispatched to Field Officer Inspection Queue.`,
      type: 'warning',
    });
  };

  const overrideEvidence = (id: string, newScore: number, newRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', mandatoryReason: string) => {
    const prevItem = evidenceList.find(e => e.id === id);
    if (!prevItem) return;

    setEvidenceList(prev =>
      prev.map(e =>
        e.id === id
          ? {
              ...e,
              integrityScore: newScore,
              riskLevel: newRisk,
              auditStatus: 'OVERRIDDEN',
              reviewer: {
                ...e.reviewer,
                assignedTo: 'Current Reviewer',
                overrideReason: mandatoryReason,
                decisionDate: new Date().toISOString(),
              },
            }
          : e
      )
    );

    const newAuditEvent: AuditEvent = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      evidenceId: id,
      projectId: prevItem.projectId,
      actorName: 'Lead Reviewer (Active Session)',
      actorRole: role,
      action: 'OVERRIDE',
      previousState: `Integrity ${prevItem.integrityScore}, Risk ${prevItem.riskLevel}`,
      newState: `Integrity ${newScore}, Risk ${newRisk} (OVERRIDDEN)`,
      reason: mandatoryReason,
      sha256Hash: prevItem.sha256,
      timestamp: new Date().toISOString(),
    };
    setAuditEvents(prev => [newAuditEvent, ...prev]);

    addToast({
      title: `AI Finding Overridden for ${id}`,
      description: `Integrity score updated to ${newScore} with recorded justification.`,
      type: 'info',
    });
  };

  const batchApprove = (ids: string[]) => {
    setEvidenceList(prev =>
      prev.map(e => (ids.includes(e.id) ? { ...e, auditStatus: 'APPROVED' } : e))
    );
    clearSelection();
    addToast({
      title: `Bulk Action Completed`,
      description: `${ids.length} evidence items approved.`,
      type: 'success',
    });
  };

  const batchFlag = (ids: string[]) => {
    setEvidenceList(prev =>
      prev.map(e => (ids.includes(e.id) ? { ...e, auditStatus: 'FLAGGED' } : e))
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
        role,
        setRole: handleSetRole,
        evidenceList,
        projects,
        auditEvents,
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

