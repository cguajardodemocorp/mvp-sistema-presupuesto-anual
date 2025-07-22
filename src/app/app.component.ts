import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { ExcelService } from './services/excel.service';
import { ExcelRow } from './models/excel-data.model';
import { MainLayoutComponent } from './components/main-layout.component';
import { ImportarGastosComponent } from './components/importar-gastos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule,
    FormsModule,
    SidebarComponent,
    FileUploadComponent,
    DataGridComponent,
    MainLayoutComponent,
    ImportarGastosComponent
  ],
  template: `
    <app-main-layout>
      <app-importar-gastos
        [selectedMonth]="selectedMonth"
        [isLoading]="isLoading"
        [uploadMessage]="uploadMessage"
        [uploadSuccess]="uploadSuccess"
        [validationErrors]="validationErrors"
        [excelData]="excelData"
        (downloadTemplate)="downloadTemplate()"
        (fileSelected)="onFileSelected($event)"
      ></app-importar-gastos>
    </app-main-layout>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      background: var(--gray-100);
    }

    .main-content {
      flex: 1;
      margin-left: 280px;
      display: flex;
      flex-direction: column;
    }

    .content-header {
      background: var(--white);
      padding: 16px 24px;
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--gray-600);
      font-size: 14px;
    }

    .breadcrumb-item.active {
      color: var(--primary-blue);
      font-weight: 500;
    }

    .breadcrumb-separator {
      color: var(--gray-400);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .notification-icon {
      color: var(--gray-500);
      cursor: pointer;
      transition: color 0.2s;
    }

    .notification-icon:hover {
      color: var(--primary-blue);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: var(--primary-blue);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      cursor: pointer;
    }

    .content-body {
      flex: 1;
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 24px;
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: 8px;
    }

    .page-description {
      color: var(--gray-600);
      line-height: 1.5;
    }

    .actions-section {
      margin-bottom: 24px;
    }

    .month-selector {
      margin-bottom: 32px;
      padding: 20px;
      background: var(--white);
      border-radius: 8px;
      box-shadow: var(--shadow);
    }

    .month-selector label {
      display: block;
      font-weight: 500;
      color: var(--gray-700);
      margin-bottom: 8px;
    }

    .month-select {
      width: 100%;
      max-width: 300px;
      padding: 10px 12px;
      border: 1px solid var(--gray-300);
      border-radius: 6px;
      font-size: 14px;
      background: var(--white);
      cursor: pointer;
    }

    .month-select:focus {
      outline: none;
      border-color: var(--primary-blue);
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
    }

    .upload-section {
      margin-bottom: 32px;
      padding: 24px;
      background: var(--white);
      border-radius: 8px;
      box-shadow: var(--shadow);
    }

    .upload-section h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }
      
      .content-body {
        padding: 16px;
      }
      
      .content-header {
        padding: 12px 16px;
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  excelData: ExcelRow[] = [];
  isLoading = false;
  uploadMessage = '';
  uploadSuccess = false;
  validationErrors: string[] = [];
  selectedMonth = '01';

  constructor(private excelService: ExcelService) {}

  ngOnInit(): void {
    this.excelService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.excelData = data;
      });

    this.excelService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  downloadTemplate(): void {
    this.excelService.downloadTemplate();
  }

  async onFileSelected(file: File): Promise<void> {
    this.uploadMessage = '';
    this.validationErrors = [];
    
    // Validar archivo
    const validation = this.excelService.validateFile(file);
    if (!validation.isValid) {
      this.uploadMessage = validation.errors.join(', ');
      this.uploadSuccess = false;
      return;
    }

    this.isLoading = true;

    try {
      // Procesar archivo Excel
      const result = await this.excelService.processExcelFile(file);
      
      if (result.errors.length > 0) {
        this.validationErrors = result.errors;
      }

      if (result.data.length === 0) {
        this.uploadMessage = 'No se encontraron datos válidos en el archivo';
        this.uploadSuccess = false;
        this.isLoading = false;
        return;
      }

      // Enviar datos al backend
      this.excelService.uploadData(result.data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.uploadMessage = `${response.message}. Se importaron ${result.data.length} registros.`;
              this.uploadSuccess = true;
            } else {
              this.uploadMessage = response.message || 'Error al importar los datos';
              this.uploadSuccess = false;
            }
          },
          error: (error) => {
            this.uploadMessage = 'Error al conectar con el servidor';
            this.uploadSuccess = false;
            this.isLoading = false;
          }
        });

    } catch (error) {
      this.uploadMessage = error instanceof Error ? error.message : 'Error al procesar el archivo';
      this.uploadSuccess = false;
      this.isLoading = false;
    }
  }
}