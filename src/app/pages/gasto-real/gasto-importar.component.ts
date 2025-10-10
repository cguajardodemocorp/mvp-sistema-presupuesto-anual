import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImportarGastosComponent } from '../../components/importar-gastos.component';
import { ExcelGastoRealService } from '../../services/excel-gasto-real.service';
import { ExcelRow } from '../../models/excel-data.model';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-gasto-real-importar',
  standalone: true,
  imports: [CommonModule, ImportarGastosComponent],
  template: `
    <app-importar-gastos
  [titulo]="'Importar gastos reales para el año ' + actualYear"
      [instrucciones]="'Los gastos se agregarán para el año 2025 y mes seleccionado. Columnas requeridas: País, Razón Social, Cuenta, CeCo, Moneda, Monto, Glosa/Descripción.'"
      [textoBoton]="'Descargar plantilla de Gastos Reales'"
      [bulletPoints]="mostrarBulletPoints ? bulletPointsPersonalizados : []"
      [tipoArchivo]="'gasto-real'"
      [mostrarSelectorMes]="true"
      [mostrarSelectorAno]="false"
      [mostrarTasasConversion]="false"
      [labelCargaArchivo]="'Cargar Excel de Gastos Reales'"
      [opcionesAno]="[
        { value: actualYear.toString(), label: actualYear.toString() },
        { value: (actualYear - 1).toString(), label: (actualYear - 1).toString() }
      ]"
      [selectedMonth]="selectedMonth"
      [isLoading]="isLoading"
      [uploadMessage]="uploadMessage"
      [uploadSuccess]="uploadSuccess"
      [validationErrors]="validationErrors"
      [excelData]="excelData"
      [rowErrors]="rowErrors"
      [onDownloadTemplate]="downloadGastoRealTemplate"
      (fileSelected)="onFileSelected($event)"
    ></app-importar-gastos>
  `
})
export class GastoRealImportarComponent implements OnInit, OnDestroy {
  actualYear = new Date().getFullYear();
  private destroy$ = new Subject<void>();

  excelData: ExcelRow[] = [];
  isLoading = false;
  uploadMessage = '';
  uploadSuccess = false;
  validationErrors: string[] = [];
  selectedMonth = '01';
  selectedYear = '01';
  rowErrors: number[] = []; // Array para almacenar índices de filas con errores

  // Configuración personalizable de bullet points
  mostrarBulletPoints = false; // Controla si se muestran o no
  bulletPointsPersonalizados = [
    'Selecciona el mes de los gastos reales',
    'El archivo debe tener formato .xlsx o .xls', 
    'Revisa que los montos sean correctos',
    'Asegúrate de que todas las columnas requeridas estén presentes',
    'Los datos deben corresponder al año y mes seleccionado'
  ];

  // Campos requeridos para el template de Gastos Reales
  requiredColumns = [
    'País',
    'Razón Social',
    'CeCo',
    'Cuenta',
    'Monto',
    'Moneda',
    'Glosa',
  ];

  constructor(private excelService: ExcelGastoRealService) {}

  ngOnInit(): void {
    // No cargar datos al iniciar la aplicación
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  downloadGastoRealTemplate = () => {
    const headers = [
      'País',
      'Razón Social',
      'CeCo',
      'Cuenta',
      'Monto',
      'Moneda',
      'Glosa',
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Gastos Reales');
    ws['!cols'] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 30 }
    ];
    XLSX.writeFile(wb, 'plantilla_gastos_reales.xlsx');
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
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0] as string[];
      const missingColumns = this.requiredColumns.filter(col => !headers.includes(col));
      if (missingColumns.length > 0) {
        this.uploadMessage = `Faltan columnas requeridas: ${missingColumns.join(', ')}`;
        this.uploadSuccess = false;
        this.isLoading = false;
        return;
      }
      const processedData: any[] = [];
      const errors: string[] = [];
      const usuario_id = 1;
      const anio = this.actualYear;
      const mes = parseInt(this.selectedMonth, 10);
      const fecha_carga = new Date().toISOString().replace('T', ' ').substring(0, 19);
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (!row || row.every(cell => !cell || cell.toString().trim() === '')) continue;
        try {
          const getValue = (col: string) => {
            const idx = headers.indexOf(col);
            return idx !== -1 ? row[idx] : '';
          };
          // Validar campos requeridos
          for (const col of this.requiredColumns) {
            const value = getValue(col);
            if (!value || value.toString().trim() === '') {
              throw new Error(`El campo "${col}" es requerido`);
            }
          }
          let monto = getValue('Monto');
          monto = typeof monto === 'number' ? monto : parseFloat(monto.toString().replace(/[^\d.-]/g, ''));
          if (isNaN(monto)) {
            throw new Error('El campo "Monto" debe ser un número válido');
          }
          processedData.push({
            pais: getValue('País').toString().trim(),
            razon_social: getValue('Razón Social').toString().trim(),
            ceco: getValue('CeCo').toString().trim(),
            cuenta: getValue('Cuenta').toString().trim(),
            monto: monto,
            moneda: getValue('Moneda').toString().trim(),
            glosa: getValue('Glosa').toString().trim(),
            anio: anio,
            mes: mes,
            usuario_id: usuario_id,
            fecha_carga: fecha_carga
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
      // Consumir el endpoint usando el servicio
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
          }
        });
    } catch (error: unknown) {
      this.uploadMessage = error instanceof Error ? error.message : 'Error al procesar el archivo';
      this.uploadSuccess = false;
      this.isLoading = false;
    }
  }
}