import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';
import { ExcelRow, UploadResponse, FileValidation } from '../models/excel-data.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private apiUrl = 'http://localhost:3000/api'; // URL del backend NestJS
  private dataSubject = new BehaviorSubject<ExcelRow[]>([]);
  public data$ = this.dataSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private requiredColumns = ['pais', 'razonSocial', 'cuenta', 'ceco', 'moneda', 'monto', 'glosa'];

  constructor(private http: HttpClient) {}

  downloadTemplate(): void {
    // Crear datos de ejemplo para la plantilla
    const templateData = [
      {
        'País': 'Colombia',
        'Razón Social': 'Empresa Ejemplo SAS',
        'Cuenta': 'cLogística',
        'CeCo': '696-654',
        'Moneda': 'COP',
        'Monto': 5000,
        'Glosa': 'Detalle de gasto'
      },
      {
        'País': 'Chile',
        'Razón Social': 'Empresa Chile Ltda',
        'Cuenta': 'cLogística',
        'CeCo': '345-987',
        'Moneda': 'CLP',
        'Monto': 12000,
        'Glosa': 'Detalle de gasto'
      }
    ];

    // Crear workbook
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla Gastos');

    // Configurar ancho de columnas
    const colWidths = [
      { wch: 15 }, // País
      { wch: 25 }, // Razón Social
      { wch: 15 }, // Cuenta
      { wch: 15 }, // CeCo
      { wch: 10 }, // Moneda
      { wch: 12 }, // Monto
      { wch: 30 }  // Glosa
    ];
    ws['!cols'] = colWidths;

    // Descargar archivo
    XLSX.writeFile(wb, 'plantilla_importacion_gastos.xlsx');
  }

  validateFile(file: File): FileValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar extensión
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      errors.push('El archivo debe ser de formato Excel (.xlsx o .xls)');
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('El archivo no puede superar los 10MB');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async processExcelFile(file: File): Promise<{ data: ExcelRow[], errors: string[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            reject(new Error('El archivo debe contener al menos una fila de datos además del encabezado'));
            return;
          }

          // Obtener encabezados
          const headers = jsonData[0] as string[];
          const normalizedHeaders = this.normalizeHeaders(headers);
          
          // Validar columnas requeridas
          const missingColumns = this.validateRequiredColumns(normalizedHeaders);
          if (missingColumns.length > 0) {
            reject(new Error(`Faltan las siguientes columnas requeridas: ${missingColumns.join(', ')}`));
            return;
          }

          // Procesar datos
          const processedData: ExcelRow[] = [];
          const errors: string[] = [];

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (this.isEmptyRow(row)) continue;

            try {
              const processedRow = this.processRow(row, normalizedHeaders, i + 1);
              processedData.push(processedRow);
            } catch (error) {
              errors.push(`Fila ${i + 1}: ${error}`);
            }
          }

          resolve({ data: processedData, errors });
        } catch (error) {
          reject(new Error('Error al procesar el archivo Excel'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsBinaryString(file);
    });
  }

  private normalizeHeaders(headers: string[]): { [key: string]: number } {
    const normalized: { [key: string]: number } = {};
    const headerMap: { [key: string]: string } = {
      'país': 'pais',
      'pais': 'pais',
      'country': 'pais',
      'razón social': 'razonSocial',
      'razon social': 'razonSocial',
      'razonsocial': 'razonSocial',
      'company': 'razonSocial',
      'cuenta': 'cuenta',
      'account': 'cuenta',
      'ceco': 'ceco',
      'centro de costo': 'ceco',
      'cost center': 'ceco',
      'moneda': 'moneda',
      'currency': 'moneda',
      'monto': 'monto',
      'amount': 'monto',
      'valor': 'monto',
      'glosa': 'glosa',
      'descripcion': 'glosa',
      'descripción': 'glosa',
      'description': 'glosa'
    };

    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().trim();
      const mappedHeader = headerMap[normalizedHeader];
      if (mappedHeader) {
        normalized[mappedHeader] = index;
      }
    });

    return normalized;
  }

  private validateRequiredColumns(normalizedHeaders: { [key: string]: number }): string[] {
    const missingColumns: string[] = [];
    
    this.requiredColumns.forEach(column => {
      if (!(column in normalizedHeaders)) {
        missingColumns.push(column);
      }
    });

    return missingColumns;
  }

  private isEmptyRow(row: any[]): boolean {
    return !row || row.every(cell => !cell || cell.toString().trim() === '');
  }

  private processRow(row: any[], headerMap: { [key: string]: number }, rowNumber: number): ExcelRow {
    const getValue = (key: string): any => {
      const index = headerMap[key];
      return row[index] || '';
    };

    // Validar y procesar monto
    const montoValue = getValue('monto');
    let monto = 0;
    
    if (montoValue !== undefined && montoValue !== null && montoValue !== '') {
      monto = typeof montoValue === 'number' ? montoValue : parseFloat(montoValue.toString().replace(/[^\d.-]/g, ''));
      if (isNaN(monto)) {
        throw new Error('El monto debe ser un número válido');
      }
    }

    // Validar campos requeridos
    const requiredFields = ['pais', 'razonSocial', 'cuenta', 'ceco', 'moneda'];
    for (const field of requiredFields) {
      const value = getValue(field);
      if (!value || value.toString().trim() === '') {
        throw new Error(`El campo ${field} es requerido`);
      }
    }

    return {
      pais: getValue('pais').toString().trim(),
      razonSocial: getValue('razonSocial').toString().trim(),
      cuenta: getValue('cuenta').toString().trim(),
      ceco: getValue('ceco').toString().trim(),
      moneda: getValue('moneda').toString().trim(),
      monto: monto,
      glosa: getValue('glosa').toString().trim()
    };
  }

  uploadData(data: ExcelRow[]): Observable<UploadResponse> {
    this.loadingSubject.next(true);
    
    // Simular llamada al backend
    return new Observable<UploadResponse>(observer => {
      setTimeout(() => {
        // Aquí iría la llamada real al backend
        // return this.http.post<UploadResponse>(`${this.apiUrl}/gastos/import`, data);
        
        this.dataSubject.next(data);
        this.loadingSubject.next(false);
        
        observer.next({
          success: true,
          message: 'Datos importados exitosamente',
          data: data
        });
        observer.complete();
      }, 2000);
    });
  }

  clearData(): void {
    this.dataSubject.next([]);
  }
}