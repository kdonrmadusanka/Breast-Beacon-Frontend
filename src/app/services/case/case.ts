import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  Annotation,
  DiagnosticReport,
  MedicalImage,
  PatientCase,
} from '../../models/patient-case.model';

export interface CasesFilter {
  status?: string;
  priority?: string;
  studyType?: string;
  dateFrom?: string;
  dateTo?: string;
  assignedTo?: string;
}

export interface CasesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CasesResponse {
  cases: PatientCase[];
  pagination: CasesPagination;
  statistics: DashboardStatistics;
}

export interface DashboardStatistics {
  totalCases: number;
  pendingCases: number;
  inProgressCases: number;
  completedCases: number;
  highPriorityCases: number;
  averageCompletionTime: number;
  weeklyWorkload: number;
}

export interface ImageUploadResponse {
  imageId: string;
  imageUrl: string;
  thumbnailUrl: string;
  success: boolean;
}

export interface ReportTemplate {
  id: string;
  name: string;
  findings: string;
  impression: string;
  recommendations: string;
  biradsScore: string;
  createdBy: string;
  isPublic: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private apiUrl = 'api/cases';
  private currentCase$ = new BehaviorSubject<PatientCase | null>(null);

  constructor(private http: HttpClient) {}

  // Case Management
  getPendingCases(page: number = 1, limit: number = 10): Observable<CasesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('status', 'pending');

    return this.http.get<CasesResponse>(`${this.apiUrl}`, { params });
  }

  getCasesWithFilters(
    filters: CasesFilter,
    page: number = 1,
    limit: number = 10
  ): Observable<CasesResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    Object.keys(filters).forEach((key) => {
      const value = filters[key as keyof CasesFilter];
      if (value) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<CasesResponse>(`${this.apiUrl}`, { params });
  }

  getCaseById(id: string): Observable<PatientCase> {
    return this.http.get<PatientCase>(`${this.apiUrl}/${id}`).pipe(
      map((caseData) => {
        this.currentCase$.next(caseData);
        return caseData;
      })
    );
  }

  assignCaseToRadiologist(caseId: string, radiologistId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${caseId}/assign`, { radiologistId });
  }

  updateCaseStatus(caseId: string, status: string, notes?: string): Observable<PatientCase> {
    return this.http.patch<PatientCase>(`${this.apiUrl}/${caseId}/status`, {
      status,
      notes,
      statusChangedAt: new Date().toISOString(),
    });
  }

  updateCasePriority(caseId: string, priority: 'high' | 'medium' | 'low'): Observable<PatientCase> {
    return this.http.patch<PatientCase>(`${this.apiUrl}/${caseId}/priority`, { priority });
  }

  // Image Management
  getCaseImages(caseId: string): Observable<MedicalImage[]> {
    return this.http.get<MedicalImage[]>(`${this.apiUrl}/${caseId}/images`);
  }

  uploadCaseImages(caseId: string, images: File[]): Observable<ImageUploadResponse[]> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    return this.http.post<ImageUploadResponse[]>(`${this.apiUrl}/${caseId}/images`, formData);
  }

  deleteCaseImage(caseId: string, imageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${caseId}/images/${imageId}`);
  }

  // Image Annotation
  addImageAnnotation(
    caseId: string,
    imageId: string,
    annotation: Omit<Annotation, 'id' | 'createdAt'>
  ): Observable<Annotation> {
    const newAnnotation: Annotation = {
      ...annotation,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };

    return this.http.post<Annotation>(
      `${this.apiUrl}/${caseId}/images/${imageId}/annotations`,
      newAnnotation
    );
  }

  updateImageAnnotation(
    caseId: string,
    imageId: string,
    annotationId: string,
    updates: Partial<Annotation>
  ): Observable<Annotation> {
    return this.http.patch<Annotation>(
      `${this.apiUrl}/${caseId}/images/${imageId}/annotations/${annotationId}`,
      updates
    );
  }

  deleteImageAnnotation(caseId: string, imageId: string, annotationId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${caseId}/images/${imageId}/annotations/${annotationId}`
    );
  }

  getImageAnnotations(caseId: string, imageId: string): Observable<Annotation[]> {
    return this.http.get<Annotation[]>(`${this.apiUrl}/${caseId}/images/${imageId}/annotations`);
  }

  // Diagnostic Reports
  createReport(
    report: Omit<DiagnosticReport, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<DiagnosticReport> {
    const newReport: DiagnosticReport = {
      ...report,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.http.post<DiagnosticReport>(`${this.apiUrl}/reports`, newReport);
  }

  updateReport(reportId: string, updates: Partial<DiagnosticReport>): Observable<DiagnosticReport> {
    const updatedReport = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.http.patch<DiagnosticReport>(`${this.apiUrl}/reports/${reportId}`, updatedReport);
  }

  getReportByCaseId(caseId: string): Observable<DiagnosticReport> {
    return this.http.get<DiagnosticReport>(`${this.apiUrl}/${caseId}/report`);
  }

  getReportHistory(caseId: string): Observable<DiagnosticReport[]> {
    return this.http.get<DiagnosticReport[]>(`${this.apiUrl}/${caseId}/report-history`);
  }

  // Report Templates
  getReportTemplates(): Observable<ReportTemplate[]> {
    return this.http.get<ReportTemplate[]>(`${this.apiUrl}/report-templates`);
  }

  createReportTemplate(template: Omit<ReportTemplate, 'id'>): Observable<ReportTemplate> {
    const newTemplate: ReportTemplate = {
      ...template,
      id: this.generateId(),
    };

    return this.http.post<ReportTemplate>(`${this.apiUrl}/report-templates`, newTemplate);
  }

  updateReportTemplate(
    templateId: string,
    updates: Partial<ReportTemplate>
  ): Observable<ReportTemplate> {
    return this.http.patch<ReportTemplate>(
      `${this.apiUrl}/report-templates/${templateId}`,
      updates
    );
  }

  deleteReportTemplate(templateId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/report-templates/${templateId}`);
  }

  // Dashboard & Analytics
  getDashboardStatistics(): Observable<DashboardStatistics> {
    return this.http.get<DashboardStatistics>(`${this.apiUrl}/dashboard/statistics`);
  }

  getWeeklyWorkload(): Observable<{ date: string; cases: number }[]> {
    return this.http.get<{ date: string; cases: number }[]>(
      `${this.apiUrl}/dashboard/weekly-workload`
    );
  }

  getCaseCompletionTime(): Observable<{ period: string; averageTime: number }[]> {
    return this.http.get<{ period: string; averageTime: number }[]>(
      `${this.apiUrl}/dashboard/completion-time`
    );
  }

  // Search & Advanced Features
  searchCases(query: string): Observable<PatientCase[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<PatientCase[]>(`${this.apiUrl}/search`, { params });
  }

  getSimilarCases(caseId: string): Observable<PatientCase[]> {
    return this.http.get<PatientCase[]>(`${this.apiUrl}/${caseId}/similar`);
  }

  exportCaseReport(caseId: string, format: 'pdf' | 'docx' = 'pdf'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${caseId}/export`, {
      params: { format },
      responseType: 'blob',
    });
  }

  // Real-time Updates
  getCurrentCase(): Observable<PatientCase | null> {
    return this.currentCase$.asObservable();
  }

  setCurrentCase(patientCase: PatientCase): void {
    this.currentCase$.next(patientCase);
  }

  clearCurrentCase(): void {
    this.currentCase$.next(null);
  }

  // Utility Methods
  private generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Batch Operations
  batchUpdateCaseStatus(caseIds: string[], status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/batch/status`, { caseIds, status });
  }

  batchAssignCases(caseIds: string[], radiologistId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/batch/assign`, { caseIds, radiologistId });
  }
}
