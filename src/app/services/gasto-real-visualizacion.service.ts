import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
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

export interface CountryApiResponse {
  id: number;
  nombre: string;
  deletedAt: string | null;
}

export interface CompanyNameApiResponse {
  id: number;
  nombre: string;
  deletedAt: string | null;
}

export interface CurrencyApiResponse {
  id: number;
  codigo: string;
  descripcion: string;
  deletedAt: string | null;
}

export interface AccountApiResponse {
  id: number;
  nombre: string;
  deletedAt: string | null;
}

export interface CecoApiResponse {
  id: number;
  codigo: string;
  descripcion: string;
  deletedAt: string | null;
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
    // Consumir la API real de eliminación
    return this.http.delete(`${this.baseUrl}/budgeSystem/v1/actual-cost/${id}`);
  }

  /**
   * Elimina múltiples gastos reales por sus IDs
   */
  eliminarMultiplesGastosReales(ids: number[]): Observable<any[]> {
    // Crear array de observables para eliminar cada registro
    const eliminaciones = ids.map(id => this.eliminarGastoReal(id));
    
    // Ejecutar todas las eliminaciones en paralelo
    return forkJoin(eliminaciones);
  }

  /**
   * Crea un nuevo gasto real
   */
  crearGastoReal(gastoData: any): Observable<any> {
    // Consumir la API real para crear
    return this.http.post(`${this.baseUrl}/budgeSystem/v1/actual-cost`, gastoData);
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
    // Consumir la API real
    return this.http.get<CountryApiResponse[]>(`${this.baseUrl}/budgeSystem/v1/country`)
      .pipe(
        map((response: CountryApiResponse[]) => 
          response.map(country => ({
            value: country.nombre,
            label: country.nombre
          }))
        )
      );
  }

  /**
   * Obtiene opciones disponibles para filtro de razones sociales
   */
  obtenerOpcionesRazonesSociales(): Observable<OpcionFiltro[]> {
    // Consumir la API real
    return this.http.get<CompanyNameApiResponse[]>(`${this.baseUrl}/budgeSystem/v1/company-name`)
      .pipe(
        map((response: CompanyNameApiResponse[]) => 
          response.map(company => ({
            value: company.nombre,
            label: company.nombre
          }))
        )
      );
  }

  /**
   * Obtiene opciones disponibles para filtro de centros de costo
   */
  obtenerOpcionesCeCos(): Observable<OpcionFiltro[]> {
    // Consumir la API real
    return this.http.get<CecoApiResponse[]>(`${this.baseUrl}/budgeSystem/v1/ceco`)
      .pipe(
        map((response: CecoApiResponse[]) => 
          response.map(ceco => ({
            value: ceco.codigo,
            label: ceco.codigo
          }))
        )
      );
  }

  /**
   * Obtiene opciones disponibles para filtro de cuentas contables
   */
  obtenerOpcionesCuentas(): Observable<OpcionFiltro[]> {
    // Consumir la API real
    return this.http.get<AccountApiResponse[]>(`${this.baseUrl}/budgeSystem/v1/account`)
      .pipe(
        map((response: AccountApiResponse[]) => 
          response.map(account => ({
            value: account.nombre,
            label: account.nombre
          }))
        )
      );
  }

  /**
   * Obtiene opciones disponibles para filtro de monedas
   */
  obtenerOpcionesMonedas(): Observable<OpcionFiltro[]> {
    // Consumir la API real
    return this.http.get<CurrencyApiResponse[]>(`${this.baseUrl}/budgeSystem/v1/currency`)
      .pipe(
        map((response: CurrencyApiResponse[]) => 
          response.map(currency => ({
            value: currency.codigo,
            label: currency.codigo
          }))
        )
      );
  }
}