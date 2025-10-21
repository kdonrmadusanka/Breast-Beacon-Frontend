export interface PatientCase {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'referred';
  studyType: 'mammogram' | 'ultrasound' | 'mri' | 'ct';
  studyDate: Date | string;
  dueDate: Date | string;
  assignedTo?: string;
  assignedRadiologist?: string;
  images: MedicalImage[];
  previousStudies?: PatientCase[];
  clinicalHistory?: string;
  referringPhysician?: string;
  statusChangedAt?: Date | string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface MedicalImage {
  id: string;
  seriesId: string;
  imageUrl: string;
  thumbnailUrl: string;
  metadata: DICOMMetadata;
  annotations?: Annotation[];
  isKeyImage?: boolean;
  windowLevel?: { center: number; width: number };
}

export interface DICOMMetadata {
  patientName: string;
  studyDate: Date | string;
  modality: string;
  bodyPart: string;
  seriesDescription?: string;
  sliceThickness?: number;
  kvp?: number;
  exposure?: number;
  manufacturerModelName?: string;
  manufacturer?: string;
  stationName?: string;
  imagePosition?: number[];
  imageOrientation?: number[];
  pixelSpacing?: number[];
  rows?: number;
  columns?: number;
  bitsAllocated?: number;
  bitsStored?: number;
  highBit?: number;
}

export interface Annotation {
  id: string;
  type: 'circle' | 'rectangle' | 'arrow' | 'text' | 'line' | 'polygon' | 'point';
  points: number[];
  label: string;
  color: string;
  description?: string;
  measurements?: { length?: number; area?: number };
  createdBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface DiagnosticReport {
  id: string;
  caseId: string;
  findings: string;
  impression: string;
  recommendations: string;
  biradsScore: '0' | '1' | '2' | '3' | '4' | '5' | '6';
  createdBy: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  signedAt?: Date | string;
  isFinal: boolean;
  templatesUsed?: string[];
}

export interface ReportForm {
  findings: string;
  impression: string;
  recommendations: string;
  biradsScore: '0' | '1' | '2' | '3' | '4' | '5' | '6';
  isFinal: boolean;
}
