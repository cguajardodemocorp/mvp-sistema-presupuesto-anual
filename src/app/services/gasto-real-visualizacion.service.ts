import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface GastoRealVisualizacion {
  id?: number;
  pais: string;
  razon_social: string;
  ceco: string;
  cuenta: string;
  monto: number;
  moneda: string;
  glosa: string;
  anio: number;
  mes: number;
  usuario_id: number;
  fecha_carga: string;
}

export interface FiltrosVisualizacion {
  anio?: number;
  mes?: number;
  pais?: string;
  razon_social?: string;
  ceco?: string;
  cuenta?: string;
  moneda?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GastoRealVisualizacionService {
  private readonly baseUrl = environment.apiBaseUrl || 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los gastos reales guardados
   */
  obtenerGastosReales(filtros?: FiltrosVisualizacion): Observable<GastoRealVisualizacion[]> {
    // TODO: Implementar llamada al endpoint real cuando esté disponible
    // return this.http.get<GastoRealVisualizacion[]>(`${this.baseUrl}/gastos-reales`, { params: filtros });
    
    // Por ahora retornamos datos de ejemplo
    return of(this.obtenerDatosEjemplo());
  }

  /**
   * Obtiene gastos reales por año y mes específico
   */
  obtenerGastosPorPeriodo(anio: number, mes: number): Observable<GastoRealVisualizacion[]> {
    const filtros: FiltrosVisualizacion = { anio, mes };
    return this.obtenerGastosReales(filtros);
  }

  /**
   * Obtiene gastos reales por país
   */
  obtenerGastosPorPais(pais: string): Observable<GastoRealVisualizacion[]> {
    const filtros: FiltrosVisualizacion = { pais };
    return this.obtenerGastosReales(filtros);
  }

  /**
   * Obtiene resumen de gastos por mes
   */
  obtenerResumenPorMes(anio: number): Observable<any> {
    // TODO: Implementar llamada al endpoint real
    // return this.http.get(`${this.baseUrl}/gastos-reales/resumen/${anio}`);
    
    return of({
      anio,
      resumen: [
        { mes: 1, total: 150000, registros: 45 },
        { mes: 2, total: 180000, registros: 52 },
        { mes: 3, total: 175000, registros: 48 }
      ]
    });
  }

  /**
   * Elimina un gasto real por ID
   */
  eliminarGastoReal(id: number): Observable<any> {
    // TODO: Implementar llamada al endpoint real
    // return this.http.delete(`${this.baseUrl}/gastos-reales/${id}`);
    
    return of({ success: true, message: 'Gasto eliminado correctamente' });
  }

  /**
   * Actualiza un gasto real
   */
  actualizarGastoReal(id: number, gasto: Partial<GastoRealVisualizacion>): Observable<GastoRealVisualizacion> {
    // TODO: Implementar llamada al endpoint real
    // return this.http.put<GastoRealVisualizacion>(`${this.baseUrl}/gastos-reales/${id}`, gasto);
    
    return of({ ...this.obtenerDatosEjemplo()[0], ...gasto, id });
  }

  /**
   * Datos de ejemplo para desarrollo
   * TODO: Remover cuando se implemente el backend real
   */
  private obtenerDatosEjemplo(): GastoRealVisualizacion[] {
    const actualYear = new Date().getFullYear();
    
    return [
      {
        id: 1,
        pais: 'Colombia',
        razon_social: 'DEMOCORP S.A.S.',
        ceco: 'CC001',
        cuenta: '51050501',
        monto: 2500000,
        moneda: 'COP',
        glosa: 'Servicios de consultoría técnica',
        anio: actualYear,
        mes: 1,
        usuario_id: 1,
        fecha_carga: '2025-01-15 10:30:00'
      },
      {
        id: 2,
        pais: 'México',
        razon_social: 'DEMOCORP MEXICO S.A. DE C.V.',
        ceco: 'CC002',
        cuenta: '51050502',
        monto: 1800000,
        moneda: 'MXN',
        glosa: 'Licencias de software',
        anio: actualYear,
        mes: 1,
        usuario_id: 1,
        fecha_carga: '2025-01-16 14:20:00'
      },
      {
        id: 3,
        pais: 'Colombia',
        razon_social: 'DEMOCORP S.A.S.',
        ceco: 'CC003',
        cuenta: '51050503',
        monto: 3200000,
        moneda: 'COP',
        glosa: 'Mantenimiento de equipos',
        anio: actualYear,
        mes: 2,
        usuario_id: 1,
        fecha_carga: '2025-02-01 09:15:00'
      },
      {
        id: 4,
        pais: 'Perú',
        razon_social: 'DEMOCORP PERU S.A.C.',
        ceco: 'CC004',
        cuenta: '51050504',
        monto: 1500000,
        moneda: 'PEN',
        glosa: 'Capacitación del personal',
        anio: actualYear,
        mes: 2,
        usuario_id: 1,
        fecha_carga: '2025-02-05 11:45:00'
      },
      {
        id: 5,
        pais: 'Chile',
        razon_social: 'DEMOCORP CHILE LTDA.',
        ceco: 'CC005',
        cuenta: '51050505',
        monto: 2800000,
        moneda: 'CLP',
        glosa: 'Servicios de outsourcing',
        anio: actualYear,
        mes: 3,
        usuario_id: 1,
        fecha_carga: '2025-03-10 16:30:00'
      }
    ];
  }
}