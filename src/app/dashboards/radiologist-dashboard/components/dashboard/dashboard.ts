import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatCardModule, MatCard } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

// Models and Services
import {
  PatientCase,
  DiagnosticReport,
  MedicalImage,
  Annotation,
  ReportForm,
} from '../../../../models/patient-case.model';
import {
  CaseService,
  CasesFilter,
  CasesResponse,
  DashboardStatistics,
  ReportTemplate,
} from '../../../../services/case/case';

@Component({
  selector: 'app-radiologist-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class RadiologistDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Dashboard Data using Signals
  cases = signal<PatientCase[]>([]);
  currentCase = signal<PatientCase | null>(null);
  dashboardStats = signal<DashboardStatistics | null>(null);

  // Filtering & Pagination
  filters = signal<CasesFilter>({});
  currentPage = signal(1);
  itemsPerPage = signal(10);
  totalCases = signal(0);

  // Computed Signals
  totalPages = computed(() => Math.ceil(this.totalCases() / this.itemsPerPage()));

  displayedCasesRange = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage() + 1;
    const end = Math.min(this.currentPage() * this.itemsPerPage(), this.totalCases());
    return { start, end };
  });

  // Search
  searchQuery = signal('');

  // Loading States
  isLoading = signal(false);
  isUpdating = signal(false);

  // ---------------------------
  // 📊 Table Configuration
  // ---------------------------

  displayedColumns: string[] = ['patient', 'studyType', 'priority', 'status', 'dueDate', 'actions'];

  // Filter Options
  priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  studyTypeOptions = [
    { value: '', label: 'All Study Types' },
    { value: 'mammogram', label: 'Mammogram' },
    { value: 'ultrasound', label: 'Ultrasound' },
    { value: 'mri', label: 'MRI' },
    { value: 'ct', label: 'CT' },
  ];

  // ---------------------------
  // 🧩 Modal & Selection States
  // ---------------------------

  showCaseDetail = signal(false);
  showReportModal = signal(false);
  showImageModal = signal(false);
  showTemplatesModal = signal(false);

  selectedImage = signal<MedicalImage | null>(null);
  currentReport = signal<DiagnosticReport | null>(null);
  reportTemplates = signal<ReportTemplate[]>([]);

  // ---------------------------
  // 📝 Report Form
  // ---------------------------

  reportForm = signal({
    findings: '',
    impression: '',
    recommendations: '',
    biradsScore: '' as '0' | '1' | '2' | '3' | '4' | '5' | '6',
    isFinal: false,
  });

  // ---------------------------
  // ✏️ Annotation Tools
  // ---------------------------

  annotationTools = [
    { type: 'circle', icon: '⭕', label: 'Circle' },
    { type: 'rectangle', icon: '⬜', label: 'Rectangle' },
    { type: 'arrow', icon: '➡️', label: 'Arrow' },
    { type: 'text', icon: '📝', label: 'Text' },
    { type: 'line', icon: '📏', label: 'Line' },
  ];

  selectedTool = signal('circle');
  annotationColor = signal('#ff0000');

  constructor(
    private caseService: CaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadReportTemplates();
    this.setupCurrentCaseSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Dashboard Data Loading
  loadDashboardData(): void {
    this.isLoading.set(true);
    this.caseService
      .getDashboardStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats: DashboardStatistics) => {
          this.dashboardStats.set(stats);
          this.loadCases();
        },
        error: (error: Error) => {
          console.error('Error loading dashboard stats:', error.message);
          this.showError('Failed to load dashboard statistics');
          this.isLoading.set(false);
        },
      });
  }

  loadCases(): void {
    this.isLoading.set(true);
    console.log('Loading cases with filters:', this.filters());
    console.log('Page:', this.currentPage(), 'Items per page:', this.itemsPerPage());

    this.caseService
      .getCasesWithFilters(this.filters(), this.currentPage(), this.itemsPerPage())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: CasesResponse) => {
          console.log('Cases response:', response);
          console.log('Cases:', response.cases);
          console.log('Total:', response.pagination.total);
          this.cases.set(response.cases);
          this.totalCases.set(response.pagination.total);
          this.isLoading.set(false);
        },
        error: (error: Error) => {
          console.error('Error loading cases:', error);
          this.isLoading.set(false);
        },
      });
  }

  // Case Management
  onSelectCase(patientCase: PatientCase): void {
    this.currentCase.set(patientCase);
    this.caseService.setCurrentCase(patientCase);
    this.loadCaseDetails(patientCase.id);
  }

  loadCaseDetails(caseId: string): void {
    this.isLoading.set(true);
    this.caseService
      .getCaseById(caseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (caseDetail: PatientCase) => {
          this.currentCase.set(caseDetail);
          this.loadCaseReport(caseId);
          this.showCaseDetail.set(true);
          this.isLoading.set(false);
        },
        error: (error: Error) => {
          console.error('Error loading case details:', error.message);
          this.isLoading.set(false);
        },
      });
  }

  onAssignToMe(caseId: string): void {
    const radiologistId = 'current-user-id'; // Get from auth service
    this.isUpdating.set(true);

    this.caseService
      .assignCaseToRadiologist(caseId, radiologistId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadCases();
          this.isUpdating.set(false);
        },
        error: (error: Error) => {
          console.error('Error assigning case:', error.message);
          this.isUpdating.set(false);
        },
      });
  }

  onUpdateStatus(caseId: string, status: string): void {
    this.isUpdating.set(true);
    this.caseService
      .updateCaseStatus(caseId, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadCases();
          if (this.currentCase()?.id === caseId) {
            this.loadCaseDetails(caseId);
          }
          this.isUpdating.set(false);
        },
        error: (error: Error) => {
          console.error('Error updating case status:', error.message);
          this.isUpdating.set(false);
        },
      });
  }

  // Image Management
  onViewImage(image: MedicalImage): void {
    this.selectedImage.set(image);
    this.showImageModal.set(true);
  }

  onAddAnnotation(imageId: string, points: number[]): void {
    if (!this.currentCase() || !this.selectedImage()) return;

    const annotation: Omit<Annotation, 'id' | 'createdAt'> = {
      type: this.selectedTool() as any,
      points,
      label: `Annotation ${(this.selectedImage()?.annotations?.length ?? 0) + 1}`,
      color: this.annotationColor(),
      createdBy: 'current-user-id',
    };

    this.caseService
      .addImageAnnotation(this.currentCase()!.id, imageId, annotation)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newAnnotation: Annotation) => {
          const currentImage = this.selectedImage();
          if (currentImage) {
            if (!currentImage.annotations) {
              currentImage.annotations = [];
            }
            currentImage.annotations.push(newAnnotation);
            this.selectedImage.set({ ...currentImage });
          }
        },
        error: (error: Error) => {
          console.error('Error adding annotation:', error.message);
        },
      });
  }

  onDeleteAnnotation(imageId: string, annotationId: string): void {
    if (!this.currentCase()) return;

    this.caseService
      .deleteImageAnnotation(this.currentCase()!.id, imageId, annotationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const currentImage = this.selectedImage();
          if (currentImage?.annotations) {
            currentImage.annotations = currentImage.annotations.filter(
              (ann: Annotation) => ann.id !== annotationId
            );
            this.selectedImage.set({ ...currentImage });
          }
        },
        error: (error: Error) => {
          console.error('Error deleting annotation:', error.message);
        },
      });
  }

  // Report Management
  loadCaseReport(caseId: string): void {
    this.caseService
      .getReportByCaseId(caseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (report: DiagnosticReport | null) => {
          this.currentReport.set(report);
          if (report) {
            this.reportForm.set({
              findings: report.findings,
              impression: report.impression,
              recommendations: report.recommendations,
              biradsScore: report.biradsScore,
              isFinal: (report as any).isFinal ?? false,
            });
          }
        },
        error: (error: Error) => {
          console.error('Error loading report:', error.message);
          this.currentReport.set(null);
        },
      });
  }

  onCreateReport(): void {
    if (!this.currentCase()) return;

    this.showReportModal.set(true);
    this.reportForm.set({
      findings: '',
      impression: '',
      recommendations: '',
      biradsScore: '0',
      isFinal: false,
    });
  }

  onSaveReport(): void {
    if (!this.currentCase()) return;

    const reportData = {
      caseId: this.currentCase()!.id,
      ...this.reportForm(),
      createdBy: 'current-user-id',
    };

    this.isUpdating.set(true);

    if (this.currentReport()) {
      this.caseService
        .updateReport(this.currentReport()!.id, reportData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedReport: DiagnosticReport) => {
            this.currentReport.set(updatedReport);
            this.showReportModal.set(false);
            this.isUpdating.set(false);
          },
          error: (error: Error) => {
            console.error('Error updating report:', error.message);
            this.isUpdating.set(false);
          },
        });
    } else {
      this.caseService
        .createReport(reportData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (newReport: DiagnosticReport) => {
            this.currentReport.set(newReport);
            this.showReportModal.set(false);
            this.isUpdating.set(false);
          },
          error: (error: Error) => {
            console.error('Error creating report:', error.message);
            this.isUpdating.set(false);
          },
        });
    }
  }

  onUseTemplate(template: ReportTemplate): void {
    const currentForm = this.reportForm();
    this.reportForm.set({
      ...currentForm,
      findings: template.findings,
      impression: template.impression,
      recommendations: template.recommendations,
      biradsScore: template.biradsScore as any,
    });
    this.showTemplatesModal.set(false);
  }

  onFinalizeReport(): void {
    const currentForm = this.reportForm();
    this.reportForm.set({
      ...currentForm,
      isFinal: true,
    });
    this.onSaveReport();
  }

  // Template Management
  loadReportTemplates(): void {
    this.caseService
      .getReportTemplates()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (templates: ReportTemplate[]) => {
          this.reportTemplates.set(templates);
        },
        error: (error: Error) => {
          console.error('Error loading templates:', error.message);
        },
      });
  }

  // Search & Filtering
  onSearch(): void {
    if (this.searchQuery().trim()) {
      this.caseService
        .searchCases(this.searchQuery())
        .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
        .subscribe({
          next: (cases: PatientCase[]) => {
            this.cases.set(cases);
          },
          error: (error: Error) => {
            console.error('Error searching cases:', error.message);
          },
        });
    } else {
      this.loadCases();
    }
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadCases();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadCases();
  }

  // Utility Methods
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'referred':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getBiradsScoreClass(score: string): string {
    switch (score) {
      case '0':
        return 'bg-gray-100 text-gray-800';
      case '1':
        return 'bg-green-100 text-green-800';
      case '2':
        return 'bg-blue-100 text-blue-800';
      case '3':
        return 'bg-yellow-100 text-yellow-800';
      case '4':
        return 'bg-orange-100 text-orange-800';
      case '5':
        return 'bg-red-100 text-red-800';
      case '6':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Modal Controls
  closeCaseDetail(): void {
    this.showCaseDetail.set(false);
    this.currentCase.set(null);
    this.caseService.clearCurrentCase();
  }

  closeReportModal(): void {
    this.showReportModal.set(false);
  }

  closeImageModal(): void {
    this.showImageModal.set(false);
    this.selectedImage.set(null);
  }

  closeTemplatesModal(): void {
    this.showTemplatesModal.set(false);
  }

  openTemplatesModal(): void {
    this.showTemplatesModal.set(true);
  }

  // Real-time Subscription
  private setupCurrentCaseSubscription(): void {
    this.caseService
      .getCurrentCase()
      .pipe(takeUntil(this.destroy$))
      .subscribe((caseData: PatientCase | null) => {
        if (caseData && caseData.id !== this.currentCase()?.id) {
          this.currentCase.set(caseData);
        }
      });
  }

  // Export Functionality
  onExportReport(format: 'pdf' | 'docx' = 'pdf'): void {
    if (!this.currentCase()) return;

    this.caseService
      .exportCaseReport(this.currentCase()!.id, format)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `report-${this.currentCase()?.patientId}-${new Date().getTime()}.${format}`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error: Error) => {
          console.error('Error exporting report:', error.message);
          this.showError('Failed to export report');
        },
      });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  // Add to your component class
  onImageClick(event: MouseEvent): void {
    if (!this.selectedImage() || this.selectedTool() === 'pan') return;

    const imgElement = event.target as HTMLImageElement;
    const rect = imgElement.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / imgElement.width) * 100;
    const y = ((event.clientY - rect.top) / imgElement.height) * 100;

    this.onAddAnnotation(this.selectedImage()!.id, [x, y, 10]); // 10px radius for circles
  }

  getAnnotationStyle(annotation: Annotation): any {
    const [x, y, radius] = annotation.points;
    return {
      left: `${x}%`,
      top: `${y}%`,
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
      border: `2px solid ${annotation.color}`,
      borderRadius: annotation.type === 'circle' ? '50%' : '0',
      transform: 'translate(-50%, -50%)',
    };
  }

  // Update the search input binding in your component
  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.onSearch();
  }

  updateReportFormField<K extends keyof ReportForm>(field: K, value: ReportForm[K]): void {
    this.reportForm.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  getPatientName(): string {
    const name = this.selectedImage()?.metadata?.patientName;
    return name ? `Medical image for ${name}` : 'Medical image';
  }
}
