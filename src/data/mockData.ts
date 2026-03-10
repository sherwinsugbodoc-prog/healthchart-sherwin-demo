import type { 
  Patient, 
  Encounter, 
  VitalSigns, 
  TimelineRecord, 
  ImagingStudy, 
  Referral, 
  BillingSummary,
  PatientListItem 
} from '@/types/emr';

export const mockPatient: Patient = {
  id: 'p1',
  firstName: 'Maria',
  lastName: 'Santos',
  middleName: 'Cruz',
  dateOfBirth: '1985-03-15',
  gender: 'female',
  mrn: 'MRN-2024-0001',
  bloodType: 'O+',
  allergies: [
    { id: 'a1', allergen: 'Penicillin', severity: 'severe', reaction: 'Anaphylaxis' },
    { id: 'a2', allergen: 'Sulfa drugs', severity: 'moderate', reaction: 'Rash' },
  ],
  alerts: [
    { id: 'al1', type: 'critical', message: 'Fall risk - High', createdAt: '2024-01-15T08:00:00Z' },
    { id: 'al2', type: 'warning', message: 'NPO after midnight', createdAt: '2024-01-15T18:00:00Z' },
  ],
};

export const mockEncounter: Encounter = {
  id: 'e1',
  patientId: 'p1',
  status: 'admitted',
  admissionDate: '2026-01-15T10:30:00Z',
  facility: 'SugboDoc Medical Center',
  department: 'Internal Medicine',
  attendingPhysician: 'Dr. Juan Dela Cruz',
  room: '405',
  bed: 'A',
  chiefComplaint: 'Chest pain and shortness of breath',
  diagnoses: [
    { id: 'd1', code: 'I20.9', description: 'Angina pectoris, unspecified', type: 'primary', status: 'active', diagnosedAt: '2024-01-15T11:00:00Z' },
    { id: 'd2', code: 'I10', description: 'Essential hypertension', type: 'secondary', status: 'active', diagnosedAt: '2024-01-15T11:00:00Z' },
    { id: 'd3', code: 'E11.9', description: 'Type 2 diabetes mellitus', type: 'secondary', status: 'active', diagnosedAt: '2024-01-15T11:00:00Z' },
  ],
};

export const mockVitals: VitalSigns[] = [
  {
    id: 'v1',
    encounterId: 'e1',
    recordedAt: '2024-01-15T14:00:00Z',
    bloodPressureSystolic: 145,
    bloodPressureDiastolic: 92,
    heartRate: 88,
    temperature: 37.2,
    respiratoryRate: 18,
    oxygenSaturation: 96,
    painLevel: 4,
    recordedBy: 'Nurse Ana Reyes',
  },
  {
    id: 'v2',
    encounterId: 'e1',
    recordedAt: '2024-01-15T10:30:00Z',
    bloodPressureSystolic: 158,
    bloodPressureDiastolic: 98,
    heartRate: 102,
    temperature: 37.5,
    respiratoryRate: 22,
    oxygenSaturation: 94,
    painLevel: 7,
    recordedBy: 'Nurse Ana Reyes',
  },
];

export const mockTimeline: TimelineRecord[] = [
  {
    id: 't1',
    type: 'soap-note',
    title: 'Progress Note',
    content: 'S: Patient reports chest pain improved from 7/10 to 4/10 after nitroglycerin. Still experiencing mild SOB on exertion.\n\nO: BP 145/92, HR 88, RR 18, O2 Sat 96% on RA. Lungs clear bilaterally. No JVD.\n\nA: Unstable angina with improving symptoms. Hypertension not at goal.\n\nP: Continue cardiac workup. Adjust antihypertensive regimen. Cardiology consult pending.',
    createdAt: '2024-01-15T14:30:00Z',
    createdBy: 'Dr. Juan Dela Cruz',
    encounterId: 'e1',
    facility: 'SugboDoc Medical Center',
  },
  {
    id: 't2',
    type: 'order',
    title: 'Laboratory Order',
    content: 'Troponin I, BNP, CBC, CMP, Lipid Panel',
    createdAt: '2024-01-15T11:15:00Z',
    createdBy: 'Dr. Juan Dela Cruz',
    encounterId: 'e1',
    facility: 'SugboDoc Medical Center',
    status: 'pending',
  },
  {
    id: 't3',
    type: 'result',
    title: 'Lab Results - Troponin I',
    content: 'Troponin I: 0.08 ng/mL (Reference: <0.04 ng/mL) - ELEVATED',
    createdAt: '2024-01-15T13:00:00Z',
    createdBy: 'Lab System',
    encounterId: 'e1',
    facility: 'SugboDoc Medical Center',
    status: 'critical',
  },
  {
    id: 't4',
    type: 'prescription',
    title: 'New Prescription',
    content: 'Aspirin 81mg PO daily\nMetoprolol 25mg PO BID\nAtorvastatin 40mg PO daily at bedtime\nNitroglycerin 0.4mg SL PRN chest pain',
    createdAt: '2024-01-15T11:30:00Z',
    createdBy: 'Dr. Juan Dela Cruz',
    encounterId: 'e1',
    facility: 'SugboDoc Medical Center',
  },
  {
    id: 't5',
    type: 'vitals',
    title: 'Vital Signs',
    content: 'BP: 145/92 mmHg | HR: 88 bpm | Temp: 37.2°C | RR: 18/min | SpO2: 96% | Pain: 4/10',
    createdAt: '2024-01-15T14:00:00Z',
    createdBy: 'Nurse Ana Reyes',
    encounterId: 'e1',
    facility: 'SugboDoc Medical Center',
    status: 'warning',
  },
  {
    id: 't6',
    type: 'diagnosis',
    title: 'Diagnosis Added',
    content: 'I20.9 - Angina pectoris, unspecified (Primary)',
    createdAt: '2024-01-15T11:00:00Z',
    createdBy: 'Dr. Juan Dela Cruz',
    encounterId: 'e1',
    facility: 'SugboDoc Medical Center',
  },
  {
    id: 't7',
    type: 'note',
    title: 'Nursing Note',
    content: 'Patient comfortable after administration of nitroglycerin. Family at bedside. Patient educated on call light use and fall precautions.',
    createdAt: '2024-01-15T12:00:00Z',
    createdBy: 'Nurse Ana Reyes',
    encounterId: 'e1',
    facility: 'SugboDoc Medical Center',
  },
  {
    id: 't8',
    type: 'procedure',
    title: '12-Lead ECG',
    content: 'ECG performed. ST depression in leads V4-V6. Findings consistent with cardiac ischemia.',
    createdAt: '2024-01-15T10:45:00Z',
    createdBy: 'ECG Tech',
    encounterId: 'e1',
    facility: 'SugboDoc Medical Center',
    status: 'warning',
  },
];

export const mockImaging: ImagingStudy[] = [
  {
    id: 'img1',
    type: 'Chest X-Ray',
    bodyPart: 'Chest',
    status: 'completed',
    orderedAt: '2024-01-15T10:40:00Z',
    completedAt: '2024-01-15T11:30:00Z',
    findings: 'Cardiomegaly noted. No acute pulmonary infiltrates. No pleural effusion.',
    hasDicom: true,
  },
  {
    id: 'img2',
    type: 'Echocardiogram',
    bodyPart: 'Heart',
    status: 'scheduled',
    orderedAt: '2024-01-15T14:00:00Z',
    hasDicom: false,
  },
  {
    id: 'img3',
    type: 'CT Coronary Angiography',
    bodyPart: 'Heart',
    status: 'ordered',
    orderedAt: '2024-01-15T14:30:00Z',
    hasDicom: false,
  },
];

export const mockReferrals: Referral[] = [
  {
    id: 'ref1',
    specialty: 'Cardiology',
    referredTo: 'Dr. Elena Garcia',
    reason: 'Evaluation for unstable angina and elevated troponin',
    status: 'pending',
    priority: 'urgent',
    createdAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'ref2',
    specialty: 'Endocrinology',
    referredTo: 'Dr. Miguel Torres',
    reason: 'Diabetes management optimization',
    status: 'scheduled',
    priority: 'routine',
    createdAt: '2024-01-15T12:00:00Z',
    scheduledDate: '2024-01-18T09:00:00Z',
  },
];

export const mockBilling: BillingSummary = {
  totalCharges: 45250.00,
  insuranceCovered: 38462.50,
  patientResponsibility: 6787.50,
  payments: 1000.00,
  balance: 5787.50,
  insuranceProvider: 'PhilHealth + Private HMO',
  policyNumber: 'PH-2024-123456',
};

export const mockPatientList: PatientListItem[] = [
  {
    id: 'pl1',
    patient: mockPatient,
    encounter: mockEncounter,
    lastUpdated: '2024-01-15T14:30:00Z',
    hasUnreadNotes: true,
    hasPendingOrders: true,
  },
  {
    id: 'pl2',
    patient: {
      id: 'p2',
      firstName: 'Jose',
      lastName: 'Rizal',
      dateOfBirth: '1960-06-19',
      gender: 'male',
      mrn: 'MRN-2024-0002',
      bloodType: 'A+',
      allergies: [],
      alerts: [],
    },
    encounter: {
      id: 'e2',
      patientId: 'p2',
      status: 'for-discharge',
      admissionDate: '2024-01-10T08:00:00Z',
      facility: 'SugboDoc Medical Center',
      department: 'Surgery',
      attendingPhysician: 'Dr. Maria Clara',
      room: '302',
      bed: 'B',
      chiefComplaint: 'Post-operative care - Appendectomy',
      diagnoses: [
        { id: 'd4', code: 'K35.80', description: 'Acute appendicitis', type: 'primary', status: 'resolved', diagnosedAt: '2024-01-10T09:00:00Z' },
      ],
    },
    lastUpdated: '2024-01-15T10:00:00Z',
    hasUnreadNotes: false,
    hasPendingOrders: false,
  },
  {
    id: 'pl3',
    patient: {
      id: 'p3',
      firstName: 'Andres',
      lastName: 'Bonifacio',
      dateOfBirth: '1975-11-30',
      gender: 'male',
      mrn: 'MRN-2024-0003',
      allergies: [{ id: 'a3', allergen: 'Iodine contrast', severity: 'moderate', reaction: 'Hives' }],
      alerts: [{ id: 'al3', type: 'info', message: 'VIP Patient', createdAt: '2024-01-14T08:00:00Z' }],
    },
    encounter: {
      id: 'e3',
      patientId: 'p3',
      status: 'admitted',
      admissionDate: '2024-01-14T14:00:00Z',
      facility: 'SugboDoc Medical Center',
      department: 'Neurology',
      attendingPhysician: 'Dr. Emilio Aguinaldo',
      room: '508',
      bed: 'A',
      chiefComplaint: 'Severe headache and visual changes',
      diagnoses: [],
    },
    lastUpdated: '2024-01-15T13:00:00Z',
    hasUnreadNotes: true,
    hasPendingOrders: true,
  },
  {
    id: 'pl4',
    patient: {
      id: 'p4',
      firstName: 'Gabriela',
      lastName: 'Silang',
      dateOfBirth: '1990-02-14',
      gender: 'female',
      mrn: 'MRN-2024-0004',
      allergies: [],
      alerts: [],
    },
    encounter: {
      id: 'e4',
      patientId: 'p4',
      status: 'discharged',
      admissionDate: '2024-01-12T10:00:00Z',
      dischargeDate: '2024-01-15T09:00:00Z',
      facility: 'SugboDoc Medical Center',
      department: 'OB-GYN',
      attendingPhysician: 'Dr. Corazon Aquino',
      room: '210',
      bed: 'A',
      chiefComplaint: 'Labor and delivery',
      diagnoses: [
        { id: 'd5', code: 'O80', description: 'Single spontaneous delivery', type: 'primary', status: 'resolved', diagnosedAt: '2024-01-12T18:00:00Z' },
      ],
    },
    lastUpdated: '2024-01-15T09:00:00Z',
    hasUnreadNotes: false,
    hasPendingOrders: false,
  },
];

export const mockAISummary = `**Clinical Summary for Maria Santos**

Mrs. Santos is a 38-year-old female admitted on January 15, 2024 with chest pain and shortness of breath. Key findings include:

• **Cardiac Concern**: Elevated Troponin I (0.08 ng/mL) with ECG showing ST depression in V4-V6, concerning for unstable angina/NSTEMI
• **Vital Trends**: BP improving from 158/98 to 145/92 mmHg; tachycardia resolved
• **Pain Control**: Chest pain decreased from 7/10 to 4/10 with nitroglycerin
• **Comorbidities**: Hypertension (not at goal), Type 2 DM

**Active Issues:**
1. Unstable angina - cardiology consult pending, echo ordered
2. Hypertension - adjusting medications
3. NKDA except Penicillin (anaphylaxis) and Sulfa drugs (rash)

**Pending Workup:**
- Echocardiogram (scheduled)
- CT Coronary Angiography (ordered)

**Recommendations:** Continue cardiac monitoring, maintain NPO status pending cath lab evaluation.`;
