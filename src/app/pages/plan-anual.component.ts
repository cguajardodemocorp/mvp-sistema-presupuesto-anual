import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImportarGastosComponent } from '../components/importar-gastos.component';
import { ExcelService } from '../services/excel.service';
import { ExcelRow } from '../models/excel-data.model';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-anual-page',
  standalone: true,
  imports: [CommonModule, ImportarGastosComponent],
  template: `
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
  `
})
export class PlanAnualPageComponent implements OnInit, OnDestroy{
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

    const validation = this.excelService.validateFile(file);
    if (!validation.isValid) {
      this.uploadMessage = validation.errors.join(', ');
      this.uploadSuccess = false;
      return;
    }

    this.isLoading = true;

    try {
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
          error: () => {
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