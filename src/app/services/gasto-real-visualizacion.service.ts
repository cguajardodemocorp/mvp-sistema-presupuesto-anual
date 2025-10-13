import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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

export interface GastoRealApiResponse {
  id: number;
  pais_id: number;
  country: {
    id: number;
    nombre: string;
    deletedAt: string | null;
  };
  razon_social_id: number;
  companyName: {
    id: number;
    nombre: string;
    deletedAt: string | null;
  };
  ceco_id: number;
  ceco: {
    id: number;
    codigo: string;
    descripcion: string;
    deletedAt: string | null;
  };
  cuenta_id: number;
  account: {
    id: number;
    nombre: string;
    deletedAt: string | null;
  };
  monto: number;
  moneda_id: number;
  currency: {
    id: number;
    codigo: string;
    descripcion: string;
    deletedAt: string | null;
  };
  glosa: string;
  anio: number;
  mes: number;
  usuario_id: number;
  fecha_carga: string;
  deletedAt: string | null;
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
    // Consumir la API real
    return this.http.get<GastoRealApiResponse[]>(`${this.baseUrl}/budgeSystem/v1/actual-cost`)
      .pipe(
        map((response: GastoRealApiResponse[]) => this.mapearRespuestaApi(response))
      );
  }

  /**
   * Mapea la respuesta de la API al formato esperado por el componente
   */
  private mapearRespuestaApi(apiData: GastoRealApiResponse[]): GastoRealVisualizacion[] {
    return apiData.map(item => ({
      id: item.id,
      pais: item.country.nombre,
      razon_social: item.companyName.nombre,
      ceco: item.ceco.codigo,
      cuenta: item.account.nombre,
      monto: item.monto,
      moneda: item.currency.codigo,
      glosa: item.glosa,
      anio: item.anio,
      mes: item.mes,
      usuario_id: item.usuario_id,
      fecha_carga: item.fecha_carga
    }));
  }

  /**
   * Formatea el número de mes con el nombre del mes
   */
  formatearMesConNombre(numeroMes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${numeroMes} ${meses[numeroMes - 1] || ''}`;
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
    return this.http.put<GastoRealApiResponse>(`${this.baseUrl}/budgeSystem/v1/actual-cost/${id}`, gasto)
      .pipe(
        map((response: GastoRealApiResponse) => this.mapearRespuestaApi([response])[0])
      );
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
}