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
    'País',
    'Razón Social',
    'CeCo',
    'Cuenta',
    'Área que planifica',
    'Recurso',
    'Localidad física',
    'Tarifa',
    'Moneda',
    'Plan Enero',
    'Plan Febrero',
    'Plan Marzo',
    'Plan Abril',
    'Plan Mayo',
    'Plan Junio',
    'Plan Julio',
    'Plan Agosto',
    'Plan Septiembre',
    'Plan Octubre',
    'Plan Noviembre',
    'Plan Diciembre'
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
    // Crear solo los encabezados sin datos de ejemplo
    const headers = [
      'País',
      'Razón Social', 
      'CeCo',
      'Cuenta',
      'Área que planifica',
      'Recurso',
      'Localidad física',
      'Tarifa',
      'Moneda',
      'Plan Enero',
      'Plan Febrero',
      'Plan Marzo',
      'Plan Abril',
      'Plan Mayo',
      'Plan Junio',
      'Plan Julio',
      'Plan Agosto',
      'Plan Septiembre',
      'Plan Octubre',
      'Plan Noviembre',
      'Plan Diciembre'
    ];

    // Crear una hoja con solo los encabezados
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plan Anual');

    ws['!cols'] = [
      { wch: 15 },  // País
      { wch: 25 },  // Razón Social
      { wch: 15 },  // CeCo
      { wch: 15 },  // Cuenta
      { wch: 20 },  // Area que planifica
      { wch: 15 },  // Recurso
      { wch: 20 },  // Localidad Física
      { wch: 12 },  // Tarifa
      { wch: 10 },  // Moneda
      { wch: 15 },  // Plan Enero
      { wch: 15 },  // Plan Febrero
      { wch: 15 },  // Plan Marzo
      { wch: 15 },  // Plan Abril
      { wch: 15 },  // Plan Mayo
      { wch: 15 },  // Plan Junio
      { wch: 15 },  // Plan Julio
      { wch: 15 },  // Plan Agosto
      { wch: 15 },  // Plan Septiembre
      { wch: 15 },  // Plan Octubre
      { wch: 15 },  // Plan Noviembre
      { wch: 15 }   // Plan Diciembre
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

          // Validar campos requeridos de texto básicos
          const basicTextFields = ['País', 'Razón Social', 'CeCo', 'Cuenta', 'Área que planifica', 'Recurso', 'Localidad física', 'Moneda'];
          for (const col of basicTextFields) {
            const value = getValue(col);
            if (!value || value.toString().trim() === '') {
              throw new Error(`El campo "${col}" es requerido`);
            }
          }

          // Validar y procesar tarifa (campo requerido numérico)
          let tarifa = getValue('Tarifa');
          if (!tarifa && tarifa !== 0) {
            throw new Error('El campo "Tarifa" es requerido');
          }
          tarifa = typeof tarifa === 'number'
            ? tarifa
            : parseFloat(tarifa.toString().replace(/[^\d.-]/g, ''));
          if (isNaN(tarifa)) {
            throw new Error('El campo "Tarifa" debe ser un número válido');
          }

          // Validar y procesar los montos de plan mensual (opcionales)
          const mesesPlan = [
            'Plan Enero', 'Plan Febrero', 'Plan Marzo', 'Plan Abril',
            'Plan Mayo', 'Plan Junio', 'Plan Julio', 'Plan Agosto',
            'Plan Septiembre', 'Plan Octubre', 'Plan Noviembre', 'Plan Diciembre'
          ];

          const planesValidados: { [key: string]: number } = {};
          let hayAlMenosUnPlan = false;
          
          for (const mes of mesesPlan) {
            let monto = getValue(mes);
            
            // Si el campo está vacío, asignar 0
            if (!monto && monto !== 0) {
              monto = 0;
            } else {
              monto = typeof monto === 'number'
                ? monto
                : parseFloat(monto.toString().replace(/[^\d.-]/g, ''));
              
              if (isNaN(monto)) {
                monto = 0;
              } else if (monto > 0) {
                hayAlMenosUnPlan = true;
              }
            }
            
            planesValidados[mes] = monto;
          }

          // Validar que al menos uno de los planes mensuales tenga un valor mayor a 0
          if (!hayAlMenosUnPlan) {
            throw new Error('Debe ingresar al menos un monto de plan mensual mayor a 0');
          }

          processedData.push({
            pais: getValue('País').toString().trim(),
            razonSocial: getValue('Razón Social').toString().trim(),
            ceco: getValue('CeCo').toString().trim(),
            cuenta: getValue('Cuenta').toString().trim(),
            areaPlanifica: getValue('Área que planifica').toString().trim(),
            recurso: getValue('Recurso').toString().trim(),
            localidadFisica: getValue('Localidad física').toString().trim(),
            tarifa: tarifa,
            moneda: getValue('Moneda').toString().trim(),
            planEnero: planesValidados['Plan Enero'],
            planFebrero: planesValidados['Plan Febrero'],
            planMarzo: planesValidados['Plan Marzo'],
            planAbril: planesValidados['Plan Abril'],
            planMayo: planesValidados['Plan Mayo'],
            planJunio: planesValidados['Plan Junio'],
            planJulio: planesValidados['Plan Julio'],
            planAgosto: planesValidados['Plan Agosto'],
            planSeptiembre: planesValidados['Plan Septiembre'],
            planOctubre: planesValidados['Plan Octubre'],
            planNoviembre: planesValidados['Plan Noviembre'],
            planDiciembre: planesValidados['Plan Diciembre']
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