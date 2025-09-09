import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImportarGastosComponent } from '../components/importar-gastos.component';
import { ExcelService } from '../services/excel.service';
import { ExcelRow } from '../models/excel-data.model';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-gasto-real-page',
  standalone: true,
  imports: [CommonModule, ImportarGastosComponent],
  template: `
    <app-importar-gastos
      [titulo]="'Importar gastos reales para el año 2025'"
      [instrucciones]="'Los gastos se agregarán para el año 2025 y mes seleccionado. Columnas requeridas: País, Razón Social, Cuenta, CeCo, Moneda, Monto, Glosa.'"
      [textoBoton]="'Descargar plantilla de Gastos Reales'"
      [bulletPoints]="mostrarBulletPoints ? bulletPointsPersonalizados : []"
      [tipoArchivo]="'gasto-real'"
      [mostrarSelectorMes]="true"
      [mostrarSelectorAno]="false"
      [mostrarTasasConversion]="false"
      [labelCargaArchivo]="'Cargar Excel de Gastos Reales'"
      [opcionesAno]="[
        { value: '2025', label: '2025' },
        { value: '2024', label: '2024' }
      ]"
      [selectedMonth]="selectedMonth"
      [isLoading]="isLoading"
      [uploadMessage]="uploadMessage"
      [uploadSuccess]="uploadSuccess"
      [validationErrors]="validationErrors"
      [excelData]="excelData"
      [onDownloadTemplate]="downloadGastoRealTemplate"
      (fileSelected)="onFileSelected($event)"
    ></app-importar-gastos>
  `
})
export class GastoRealPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  excelData: ExcelRow[] = [];
  isLoading = false;
  uploadMessage = '';
  uploadSuccess = false;
  validationErrors: string[] = [];
  selectedMonth = '01';

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

  constructor(private excelService: ExcelService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.excelService.getAnnualPlans()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.excelData = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Métodos para personalizar bullet points
  toggleBulletPoints(): void {
    this.mostrarBulletPoints = !this.mostrarBulletPoints;
  }

  setBulletPoints(puntos: string[]): void {
    this.bulletPointsPersonalizados = puntos;
  }

  agregarBulletPoint(punto: string): void {
    this.bulletPointsPersonalizados.push(punto);
  }

  eliminarBulletPoint(indice: number): void {
    if (indice >= 0 && indice < this.bulletPointsPersonalizados.length) {
      this.bulletPointsPersonalizados.splice(indice, 1);
    }
  }

  // Función personalizada para descargar la plantilla de gastos reales
  downloadGastoRealTemplate = () => {
    // Crear solo los encabezados sin datos de ejemplo
    const headers = [
    'País',
    'Razón Social',
    'CeCo',
    'Cuenta',
    'Monto',
    'Moneda',
    'Glosa',
    ];

    // Crear una hoja con solo los encabezados
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Gastos Reales');

    ws['!cols'] = [
      { wch: 15 },  // País
      { wch: 25 },  // Razón Social
      { wch: 15 },  // CeCo
      { wch: 15 },  // Cuenta
      { wch: 15 },  // Monto
      { wch: 10 },  // Moneda
      { wch: 30 }   // Glosa
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

      // Procesar filas según el template de Gastos Reales
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

          // Validar campos requeridos de texto
          const basicTextFields = ['País', 'Razón Social', 'CeCo', 'Cuenta', 'Moneda', 'Glosa'];
          for (const col of basicTextFields) {
            const value = getValue(col);
            if (!value || value.toString().trim() === '') {
              throw new Error(`El campo "${col}" es requerido`);
            }
          }

          // Validar y procesar monto (campo requerido numérico)
          let monto = getValue('Monto');
          if (!monto && monto !== 0) {
            throw new Error('El campo "Monto" es requerido');
          }
          monto = typeof monto === 'number'
            ? monto
            : parseFloat(monto.toString().replace(/[^\d.-]/g, ''));
          if (isNaN(monto)) {
            throw new Error('El campo "Monto" debe ser un número válido');
          }

          // Validar que el monto sea mayor que 0
          if (monto <= 0) {
            throw new Error('El monto debe ser mayor que 0');
          }

          processedData.push({
            pais: getValue('País').toString().trim(),
            razonSocial: getValue('Razón Social').toString().trim(),
            ceco: getValue('CeCo').toString().trim(),
            cuenta: getValue('Cuenta').toString().trim(),
            areaPlanifica: '',
            recurso: '',
            localidadFisica: getValue('Glosa').toString().trim(), // Usar Glosa como localidad física
            tarifa: 0,
            moneda: getValue('Moneda').toString().trim(),
            planEnero: 0,
            planFebrero: 0,
            planMarzo: 0,
            planAbril: 0,
            planMayo: 0,
            planJunio: 0,
            planJulio: 0,
            planAgosto: 0,
            planSeptiembre: 0,
            planOctubre: 0,
            planNoviembre: 0,
            planDiciembre: monto // Poner el monto en diciembre para que se vea en el grid
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
        .subscribe(
          (responses) => {
            this.uploadMessage = `Se importaron ${responses.length} registros.`;
            this.uploadSuccess = true;
            this.isLoading = false;
          },
          () => {
            this.uploadMessage = 'Error al importar los datos';
            this.uploadSuccess = false;
            this.isLoading = false;
          }
        );

    } catch (error) {
      this.uploadMessage = error instanceof Error ? error.message : 'Error al procesar el archivo';
      this.uploadSuccess = false;
      this.isLoading = false;
    }
  }
}