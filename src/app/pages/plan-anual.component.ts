import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImportarGastosComponent } from '../components/importar-gastos.component';
import { ExcelService } from '../services/excel.service';
import { ExcelRow } from '../models/excel-data.model';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-plan-anual-page',
  standalone: true,
  imports: [CommonModule, ImportarGastosComponent],
  template: `
    <app-importar-gastos
      [titulo]="'Importar Plan Anual - Año 2025'"
      [instrucciones]="'EL plan se importará para el año 2025. Descarga la plantilla oficial para este año.'"
      [textoBoton]="'Descargar plantilla de Plan Anual'"
      [bulletPoints]="[
        'El archivo debe contener las columnas obligatorias',
        'Solo se permiten valores válidos para el plan anual'
      ]"
      [selectedMonth]="selectedMonth"
      [isLoading]="isLoading"
      [uploadMessage]="uploadMessage"
      [uploadSuccess]="uploadSuccess"
      [validationErrors]="validationErrors"
      [excelData]="excelData"
      [onDownloadTemplate]="downloadPlanAnualTemplate"
      (fileSelected)="onFileSelected($event)"
    ></app-importar-gastos>
  `
})
export class PlanAnualPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  excelData: ExcelRow[] = [];
  isLoading = false;
  uploadMessage = '';
  uploadSuccess = false;
  validationErrors: string[] = [];
  selectedMonth = '01';

  // Campos requeridos para el template de Plan Anual
  requiredColumns = [
    'Año',
    'País',
    'Razón Social',
    'Cuenta',
    'CeCo',
    'Moneda',
    'Monto Planificado',
    'Glosa'
  ];

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

  // Función personalizada para descargar la plantilla de plan anual
  downloadPlanAnualTemplate = () => {
    const templateData = [
      {
        'Año': '2025',
        'País': 'Colombia',
        'Razón Social': 'Empresa Ejemplo SAS',
        'Cuenta': 'cLogística',
        'CeCo': '696-654',
        'Moneda': 'COP',
        'Monto Planificado': 10000,
        'Glosa': 'Detalle plan anual'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plan Anual');

    ws['!cols'] = [
      { wch: 6 },   // Año
      { wch: 15 },  // País
      { wch: 25 },  // Razón Social
      { wch: 15 },  // Cuenta
      { wch: 15 },  // CeCo
      { wch: 10 },  // Moneda
      { wch: 18 },  // Monto Planificado
      { wch: 30 }   // Glosa
    ];

    XLSX.writeFile(wb, 'plantilla_plan_anual.xlsx');
  };

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
      // Leer el archivo Excel y obtener los encabezados
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0] as string[];
      const missingColumns = this.requiredColumns.filter(col => !headers.includes(col));
      if (missingColumns.length > 0) {
        this.uploadMessage = `Faltan las siguientes columnas requeridas: ${missingColumns.join(', ')}`;
        this.uploadSuccess = false;
        this.isLoading = false;
        return;
      }

      // Procesar filas según el template de Plan Anual
      const processedData: ExcelRow[] = [];
      const errors: string[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (!row || row.every(cell => !cell || cell.toString().trim() === '')) continue;

        try {
          // Mapear los valores según el encabezado
          const getValue = (col: string) => {
            const idx = headers.indexOf(col);
            return idx !== -1 ? row[idx] : '';
          };

          // Validar campos requeridos
          for (const col of this.requiredColumns) {
            if (!getValue(col) || getValue(col).toString().trim() === '') {
              throw new Error(`El campo "${col}" es requerido`);
            }
          }

          // Validar y procesar monto planificado
          let montoPlanificado = getValue('Monto Planificado');
          montoPlanificado = typeof montoPlanificado === 'number'
            ? montoPlanificado
            : parseFloat(montoPlanificado.toString().replace(/[^\d.-]/g, ''));
          if (isNaN(montoPlanificado)) {
            throw new Error('El campo "Monto Planificado" debe ser un número válido');
          }

          processedData.push({
            pais: getValue('País').toString().trim(),
            razonSocial: getValue('Razón Social').toString().trim(),
            cuenta: getValue('Cuenta').toString().trim(),
            ceco: getValue('CeCo').toString().trim(),
            moneda: getValue('Moneda').toString().trim(),
            monto: montoPlanificado,
            glosa: getValue('Glosa').toString().trim()
          });
        } catch (error) {
          errors.push(`Fila ${i + 1}: ${error}`);
        }
      }

      this.excelData = processedData;
      this.validationErrors = errors;

      if (processedData.length === 0) {
        this.uploadMessage = 'No se encontraron datos válidos en el archivo';
        this.uploadSuccess = false;
        this.isLoading = false;
        return;
      }

      this.excelService.uploadData(processedData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.uploadMessage = `${response.message}. Se importaron ${processedData.length} registros.`;
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