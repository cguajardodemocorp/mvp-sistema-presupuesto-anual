import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImportarGastosComponent } from '../../components/importar-gastos.component';
import { ExcelAnualPlanService } from '../../services/excel-anual-plan.service';
import { ExcelRow } from '../../models/excel-data.model';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-plan-anual-importar',
  standalone: true,
  imports: [CommonModule, ImportarGastosComponent],
  template: `
    <app-importar-gastos
      [tituloHtml]="'Importar Plan Anual - Año <b>' + actualYear + '</b>'"
      [instruccionesHtml]="'EL plan se importará para el año <b>' + actualYear + '</b>. Para realizar la importación del plan anual de presupuesto, primero debes descargar la <b>plantilla oficial</b>, la cual contiene los valores predeterminados y el formato correcto. Solo se admiten archivos en formato <b>.xlsx</b> o <b>.xls</b>.'"
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
      [rowErrors]="rowErrors"
      [onDownloadTemplate]="downloadPlanAnualTemplate"
      [opcionesAno]="[
        { value: actualYear.toString(), label: actualYear.toString() },
        { value: (actualYear - 1).toString(), label: (actualYear - 1).toString() }
      ]"
      [selectedYear]="selectedYear"
      (fileSelected)="onFilePlanSelected($event)"
    ></app-importar-gastos>
  `
})
export class PlanAnualImportarComponent implements OnInit, OnDestroy {
  actualYear = new Date().getFullYear(); //se obtiene el año actual del sistema
  selectedYear = this.actualYear.toString();
  private destroy$ = new Subject<void>();

  excelData: ExcelRow[] = [];
  isLoading = false;
  uploadMessage = '';
  uploadSuccess = false;
  validationErrors: string[] = [];
  selectedMonth = '01';
  rowErrors: number[] = []; // Array para almacenar índices de filas con errores

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

  constructor(private excelService: ExcelAnualPlanService) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  downloadPlanAnualTemplate = () => {
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
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plan Anual');
    //Ancho de columnas de plantilla, se ajustan segun orden del arreglo anterior
    ws['!cols'] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 25 },
      { wch: 45 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];
    XLSX.writeFile(wb, 'plantilla_plan_anual.xlsx');
  };

  async onFilePlanSelected(file: File): Promise<void> {
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
      const processedData: ExcelRow[] = [];
      const errors: string[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (!row || row.every(cell => !cell || cell.toString().trim() === '')) continue;
        try {
          const getValue = (col: string) => {
            const idx = headers.indexOf(col);
            return idx !== -1 ? row[idx] : '';
          };
          const basicTextFields = ['País', 'Razón Social', 'CeCo', 'Cuenta', 'Área que planifica', 'Recurso', 'Localidad física', 'Moneda'];
          for (const col of basicTextFields) {
            const value = getValue(col);
            if (!value || value.toString().trim() === '') {
              throw new Error(`El campo "${col}" es requerido`);
            }
          }
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
          const mesesPlan = [
            'Plan Enero', 'Plan Febrero', 'Plan Marzo', 'Plan Abril',
            'Plan Mayo', 'Plan Junio', 'Plan Julio', 'Plan Agosto',
            'Plan Septiembre', 'Plan Octubre', 'Plan Noviembre', 'Plan Diciembre'
          ];
          const planesValidados: { [key: string]: number | undefined } = {};
          for (const mes of mesesPlan) {
            let monto = getValue(mes);
            if (!monto && monto !== 0) {
              // Si el campo está vacío o undefined, se deja como undefined (blanco)
              planesValidados[mes] = undefined;
            } else {
              monto = typeof monto === 'number'
                ? monto
                : parseFloat(monto.toString().replace(/[^\d.-]/g, ''));
              if (isNaN(monto)) {
                // Si no es un número válido, se deja como undefined (blanco)
                planesValidados[mes] = undefined;
              } else {
                planesValidados[mes] = monto;
              }
            }
          }
          // Eliminada la validación obligatoria de al menos un plan mayor a 0
          processedData.push({
            pais: getValue('País').toString(),
            razonSocial: getValue('Razón Social').toString(),
            ceco: getValue('CeCo').toString(),
            cuenta: getValue('Cuenta').toString(),
            areaPlanifica: getValue('Área que planifica').toString(),
            recurso: getValue('Recurso').toString(),
            localidadFisica: getValue('Localidad física').toString(),
            tarifa: tarifa,
            moneda: getValue('Moneda').toString(),
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
      console.log('Enviando a la API /budgeSystem/v1/annual-plans', processedData);
      this.excelService.uploadData(processedData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            const successCount = response.success.length;
            const errorCount = response.errors.length;
            
            // Actualizar array de filas con errores
            this.rowErrors = response.errors.map(error => error.rowIndex);
            
            if (errorCount > 0) {
              // Generar mensaje con detalles de errores
              const errorMessages = response.errors.map(err => 
                `Fila ${err.rowIndex + 1}: ${err.error}`
              ).join('\n');
              
              this.uploadMessage = `Se importaron ${successCount} registros. ${errorCount} registros con errores:\n${errorMessages}`;
              this.uploadSuccess = successCount > 0;
              this.validationErrors = response.errors.map(err => `Fila ${err.rowIndex + 1}: ${err.error}`);
            } else {
              this.uploadMessage = `Se importaron ${successCount} registros exitosamente.`;
              this.uploadSuccess = true;
              this.validationErrors = [];
            }
            
            this.isLoading = false;
          },
          error: (err) => {
            if (err && err.error && err.error.message) {
              this.uploadMessage = err.error.message;
            } else {
              this.uploadMessage = 'Error al importar los datos';
            }
            this.uploadSuccess = false;
            this.isLoading = false;
            this.rowErrors = [];
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    } catch (error: unknown) {
      this.uploadMessage = error instanceof Error ? error.message : 'Error al procesar el archivo';
      this.uploadSuccess = false;
      this.isLoading = false;
    }
  }
}