import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import * as XLSX from 'xlsx';
import { ExcelRow, UploadResponse, FileValidation } from '../models/excel-data.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private apiUrl = 'http://localhost:3000/api'; // URL del backend NestJS

  private requiredColumns = ['pais', 'razonSocial', 'cuenta', 'ceco', 'moneda', 'monto', 'glosa'];

  constructor(private http: HttpClient) {}

  // Obtener un registro de plan anual por id
  getAnnualPlanById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/budgeSystem/v1/annual-plans/${id}`);
  }

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

    // Este método mantiene compatibilidad con la estructura antigua por ahora
    // pero debería ser actualizado para usar la nueva estructura según el contexto
    
    // Para gastos reales (estructura antigua)
    if ('monto' in headerMap) {
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
        ceco: getValue('ceco').toString().trim(),
        cuenta: getValue('cuenta').toString().trim(),
        areaPlanifica: '',
        recurso: '',
        localidadFisica: '',
        tarifa: 0,
        moneda: getValue('moneda').toString().trim(),
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
        planDiciembre: monto // Poner el monto en diciembre por compatibilidad
      } as ExcelRow;
    }

    // Para plan anual (nueva estructura) - este caso no debería llegar aquí
    // ya que plan-anual.component.ts maneja su propio procesamiento
    throw new Error('Estructura de datos no reconocida');
  }

  // Envía cada registro a la API real usando POST
  // Mapea ExcelRow al formato del backend usando valores por defecto
  private mapExcelRowToBackend(row: ExcelRow): any {
    return {
      pais_id: 1, // Valor por defecto, reemplazar por lógica real si es necesario
      razon_social_id: 1, // Valor por defecto
      ceco_id: 1, // Valor por defecto
      cuenta_id: 1, // Valor por defecto
      area_id: 1, // Valor por defecto
      recurso_id: 1, // Valor por defecto
      local_id: 1, // Valor por defecto
      tarifa: row.tarifa || 0,
      moneda_id: 1, // Valor por defecto
      anio: new Date().getFullYear(), // Año actual
      usuario_id: 1, // Valor por defecto
      fecha_carga: new Date().toISOString().slice(0, 19).replace('T', ' '), // Fecha actual en formato backend
      tipo_carga: 'NORMAL', // Valor por defecto
      mes: new Date().getMonth() + 1, // Mes actual
      cantidad: row.planDiciembre || 0 // Ejemplo: usar planDiciembre como cantidad
    };
  }

  uploadData(data: ExcelRow[]): Observable<any[]> {
    const requests = data.map(row => {
      const body = this.mapExcelRowToBackend(row);
      return this.http.post<any>('http://localhost:3000/budgeSystem/v1/annual-plans', body);
    });
    return forkJoin(requests);
  }


  // Método para listar todos los planes anuales
  getAnnualPlans(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/budgeSystem/v1/annual-plans');
  }
}