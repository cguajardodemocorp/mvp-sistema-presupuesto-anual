import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataGridVisualizarComponent } from '../../components/data-grid-visualizar/data-grid-visualizar.component';
import { GastoRealVisualizacionService, GastoRealVisualizacion, FiltrosVisualizacion } from '../../services/gasto-real-visualizacion.service';

@Component({
  selector: 'app-gasto-real-visualizar',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGridVisualizarComponent],
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-10 w-full border border-gray-100">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
        Visualizar Gastos Reales - Año {{ actualYear }}
      </h1>
      <p class="text-gray-600 mb-6 text-sm sm:text-base">
        <b>Información:</b> Aquí puedes visualizar todos los gastos reales cargados en el sistema. 
        Utiliza los filtros para buscar información específica.
      </p>

      <!-- Sección de Filtros -->
      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Filtros de Búsqueda</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <!-- Filtro por Año -->
          <div>
            <label for="filtroAnio" class="block text-sm font-medium text-gray-700 mb-1">Año:</label>
            <select
              id="filtroAnio"
              [(ngModel)]="filtros.anio"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 text-sm"
              (change)="aplicarFiltros()"
            >
              <option value="">Todos los años</option>
              <option [value]="actualYear">{{ actualYear }}</option>
              <option [value]="actualYear - 1">{{ actualYear - 1 }}</option>
            </select>
          </div>

          <!-- Filtro por Mes -->
          <div>
            <label for="filtroMes" class="block text-sm font-medium text-gray-700 mb-1">Mes:</label>
            <select
              id="filtroMes"
              [(ngModel)]="filtros.mes"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 text-sm"
              (change)="aplicarFiltros()"
            >
              <option value="">Todos los meses</option>
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              <option value="3">Marzo</option>
              <option value="4">Abril</option>
              <option value="5">Mayo</option>
              <option value="6">Junio</option>
              <option value="7">Julio</option>
              <option value="8">Agosto</option>
              <option value="9">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>

          <!-- Filtro por País -->
          <div>
            <label for="filtroPais" class="block text-sm font-medium text-gray-700 mb-1">País:</label>
            <select
              id="filtroPais"
              [(ngModel)]="filtros.pais"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 text-sm"
              (change)="aplicarFiltros()"
            >
              <option value="">Todos los países</option>
              <option value="Colombia">Colombia</option>
              <option value="México">México</option>
              <option value="Perú">Perú</option>
              <option value="Chile">Chile</option>
            </select>
          </div>

          <!-- Filtro por Moneda -->
          <div>
            <label for="filtroMoneda" class="block text-sm font-medium text-gray-700 mb-1">Moneda:</label>
            <select
              id="filtroMoneda"
              [(ngModel)]="filtros.moneda"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 text-sm"
              (change)="aplicarFiltros()"
            >
              <option value="">Todas las monedas</option>
              <option value="COP">COP</option>
              <option value="MXN">MXN</option>
              <option value="PEN">PEN</option>
              <option value="CLP">CLP</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex flex-wrap gap-2">
          <button
            class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-md shadow transition"
            (click)="cargarDatos()"
            [disabled]="isLoading"
          >
            <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Cargando...' : 'Buscar' }}
          </button>
          
          <button
            class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md shadow transition"
            (click)="limpiarFiltros()"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Mensajes de estado -->
      <div *ngIf="mensaje" class="mb-4">
        <div [ngClass]="mensajeExito ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
             class="rounded px-4 py-2">
          {{ mensaje }}
        </div>
      </div>

      <!-- Grilla de datos - siempre visible -->
      <app-data-grid-visualizar 
        [data]="gastosReales" 
        [tipoGrid]="'gasto-real'"
        [isLoading]="isLoading">
      </app-data-grid-visualizar>

      <!-- Mensaje cuando no hay datos -->
      <div *ngIf="!isLoading && gastosReales.length === 0" 
           class="text-center py-12 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-lg font-medium">No se encontraron gastos reales</p>
        <p class="text-sm mt-1">Intenta ajustar los filtros de búsqueda o importa nuevos datos.</p>
      </div>
    </div>
  `
})
export class GastoRealVisualizarComponent implements OnInit, OnDestroy {
  actualYear = new Date().getFullYear();
  private destroy$ = new Subject<void>();

  // Datos y estado
  gastosReales: GastoRealVisualizacion[] = [];
  isLoading = false;
  mensaje = '';
  mensajeExito = false;

  // Filtros
  filtros: FiltrosVisualizacion = {
    anio: this.actualYear,
    mes: undefined,
    pais: '',
    moneda: ''
  };

  constructor(private gastoVisualizacionService: GastoRealVisualizacionService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.mensaje = '';

    // Limpiar filtros vacíos
    const filtrosLimpios = this.limpiarFiltrosVacios(this.filtros);

    this.gastoVisualizacionService.obtenerGastosReales(filtrosLimpios)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (datos) => {
          this.gastosReales = datos;
          this.isLoading = false;
          
          if (datos.length === 0) {
            this.mensaje = 'No se encontraron gastos reales con los filtros aplicados.';
            this.mensajeExito = false;
          } else {
            this.mensaje = `Se encontraron ${datos.length} registros.`;
            this.mensajeExito = true;
          }
        },
        error: (error) => {
          console.error('Error al cargar gastos reales:', error);
          this.mensaje = 'Error al cargar los datos. Por favor, intenta nuevamente.';
          this.mensajeExito = false;
          this.isLoading = false;
          this.gastosReales = [];
        }
      });
  }

  aplicarFiltros(): void {
    // Auto-aplicar filtros cuando cambie algún valor
    // Se podría agregar un debounce aquí si es necesario
    this.cargarDatos();
  }

  limpiarFiltros(): void {
    this.filtros = {
      anio: this.actualYear,
      mes: undefined,
      pais: '',
      moneda: ''
    };
    this.cargarDatos();
  }

  private limpiarFiltrosVacios(filtros: FiltrosVisualizacion): FiltrosVisualizacion {
    const filtrosLimpios: FiltrosVisualizacion = {};
    
    Object.keys(filtros).forEach(key => {
      const valor = (filtros as any)[key];
      if (valor !== '' && valor !== null && valor !== undefined) {
        (filtrosLimpios as any)[key] = valor;
      }
    });
    
    return filtrosLimpios;
  }
}