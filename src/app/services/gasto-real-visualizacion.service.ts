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
  mes?: number | string;
  pais?: string;
  razon_social?: string;
  ceco?: string;
  cuenta?: string;
  moneda?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface OpcionFiltro {
  value: string;
  label: string;
  count?: number; // Opcional: cantidad de registros con este valor
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
   * Obtiene opciones disponibles para filtro de países
   */
  obtenerOpcionesPaises(): Observable<OpcionFiltro[]> {
    // TODO: Implementar llamada al endpoint real
    // return this.http.get<OpcionFiltro[]>(`${this.baseUrl}/filtros/paises`);
    
    return of([
      { value: 'Colombia', label: 'Colombia', count: 125 },
      { value: 'México', label: 'México', count: 89 },
      { value: 'Perú', label: 'Perú', count: 67 },
      { value: 'Chile', label: 'Chile', count: 54 },
      { value: 'Argentina', label: 'Argentina', count: 32 }
    ]);
  }

  /**
   * Obtiene opciones disponibles para filtro de razones sociales
   */
  obtenerOpcionesRazonesSociales(): Observable<OpcionFiltro[]> {
    // TODO: Implementar llamada al endpoint real
    // return this.http.get<OpcionFiltro[]>(`${this.baseUrl}/filtros/razones-sociales`);
    
    return of([
      { value: 'DEMOCORP S.A.S.', label: 'DEMOCORP S.A.S.', count: 156 },
      { value: 'DEMOCORP MEXICO S.A. DE C.V.', label: 'DEMOCORP MEXICO S.A. DE C.V.', count: 89 },
      { value: 'DEMOCORP PERU S.A.C.', label: 'DEMOCORP PERU S.A.C.', count: 67 },
      { value: 'DEMOCORP CHILE LTDA.', label: 'DEMOCORP CHILE LTDA.', count: 54 },
      { value: 'DEMOCORP ARGENTINA S.A.', label: 'DEMOCORP ARGENTINA S.A.', count: 32 }
    ]);
  }

  /**
   * Obtiene opciones disponibles para filtro de centros de costo
   */
  obtenerOpcionesCeCos(): Observable<OpcionFiltro[]> {
    // TODO: Implementar llamada al endpoint real
    // return this.http.get<OpcionFiltro[]>(`${this.baseUrl}/filtros/cecos`);
    
    return of([
      { value: 'CC001', label: 'CC001 - Administración', count: 89 },
      { value: 'CC002', label: 'CC002 - Ventas', count: 76 },
      { value: 'CC003', label: 'CC003 - Operaciones', count: 65 },
      { value: 'CC004', label: 'CC004 - IT', count: 54 },
      { value: 'CC005', label: 'CC005 - RRHH', count: 43 },
      { value: 'CC006', label: 'CC006 - Finanzas', count: 38 },
      { value: 'CC007', label: 'CC007 - Marketing', count: 32 }
    ]);
  }

  /**
   * Obtiene opciones disponibles para filtro de cuentas contables
   */
  obtenerOpcionesCuentas(): Observable<OpcionFiltro[]> {
    // TODO: Implementar llamada al endpoint real
    // return this.http.get<OpcionFiltro[]>(`${this.baseUrl}/filtros/cuentas`);
    
    return of([
      { value: '51050501', label: '51050501 - Servicios de Consultoría', count: 78 },
      { value: '51050502', label: '51050502 - Licencias de Software', count: 65 },
      { value: '51050503', label: '51050503 - Mantenimiento', count: 54 },
      { value: '51050504', label: '51050504 - Capacitación', count: 43 },
      { value: '51050505', label: '51050505 - Outsourcing', count: 39 },
      { value: '51050506', label: '51050506 - Suministros', count: 32 },
      { value: '51050507', label: '51050507 - Transportes', count: 28 }
    ]);
  }

  /**
   * Obtiene opciones disponibles para filtro de monedas
   */
  obtenerOpcionesMonedas(): Observable<OpcionFiltro[]> {
    // TODO: Implementar llamada al endpoint real
    // return this.http.get<OpcionFiltro[]>(`${this.baseUrl}/filtros/monedas`);
    
    return of([
      { value: 'COP', label: 'COP - Peso Colombiano', count: 156 },
      { value: 'MXN', label: 'MXN - Peso Mexicano', count: 89 },
      { value: 'PEN', label: 'PEN - Sol Peruano', count: 67 },
      { value: 'CLP', label: 'CLP - Peso Chileno', count: 54 },
      { value: 'USD', label: 'USD - Dólar Americano', count: 45 },
      { value: 'ARS', label: 'ARS - Peso Argentino', count: 32 }
    ]);
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