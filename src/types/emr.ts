export type EncounterStatus = 'admitted' | 'for-discharge' | 'discharged';

export type RecordType = 
  | 'vitals' 
  | 'soap-note' 
  | 'diagnosis' 
  | 'prescription' 
  | 'order' 
  | 'result' 
  | 'procedure' 
  | 'imaging' 
  | 'referral' 
  | 'note';

export type ClinicalStatus = 'critical' | 'warning' | 'success' | 'info' | 'pending';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  mrn: string; // Medical Record Number
  photo?: string;
  bloodType?: string;
  allergies: Allergy[];
  alerts: Alert[];
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  createdAt: string;
}

export interface Encounter {
  id: string;
  patientId: string;
  status: EncounterStatus;
  admissionDate: string;
  dischargeDate?: string;
  facility: string;
  department: string;
  attendingPhysician: string;
  room?: string;
  bed?: string;
  chiefComplaint: string;
  diagnoses: Diagnosis[];
}

export interface Diagnosis {
  id: string;
  code: string; // ICD code
  description: string;
  type: 'primary' | 'secondary' | 'admitting';
  status: 'active' | 'resolved';
  diagnosedAt: string;
}

export interface VitalSigns {
  id: string;
  encounterId: string;
  recordedAt: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  painLevel?: number;
  recordedBy: string;
}

export interface TimelineRecord {
  id: string;
  type: RecordType;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  encounterId: string;
  facility: string;
  status?: ClinicalStatus;
  metadata?: Record<string, unknown>;
}

export interface ImagingStudy {
  id: string;
  type: string; // CT, MRI, X-Ray, Ultrasound, etc.
  bodyPart: string;
  status: 'ordered' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  orderedAt: string;
  completedAt?: string;
  findings?: string;
  hasDicom: boolean;
  thumbnailUrl?: string;
}

export interface Referral {
  id: string;
  specialty: string;
  referredTo: string;
  reason: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'stat';
  createdAt: string;
  scheduledDate?: string;
  attachments?: string[];
}

export interface BillingSummary {
  totalCharges: number;
  insuranceCovered: number;
  patientResponsibility: number;
  payments: number;
  balance: number;
  insuranceProvider?: string;
  policyNumber?: string;
}

export interface PatientListItem {
  id: string;
  patient: Patient;
  encounter: Encounter;
  lastUpdated: string;
  hasUnreadNotes: boolean;
  hasPendingOrders: boolean;
}
