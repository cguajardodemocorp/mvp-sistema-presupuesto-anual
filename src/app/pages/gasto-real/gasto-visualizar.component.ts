import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { DataGridVisualizarComponent } from '../../components/data-grid-visualizar/data-grid-visualizar.component';
import { GastoRealVisualizacionService, GastoRealVisualizacion, FiltrosVisualizacion, OpcionFiltro } from '../../services/gasto-real-visualizacion.service';

@Component({
  selector: 'app-gasto-real-visualizar',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGridVisualizarComponent],
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-10 w-full border border-gray-100">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
        Gasto Real - Año {{ actualYear }}
      </h1>

      <!-- Sección de Filtros Desplegable -->
      <div class="bg-gray-50 rounded-lg mb-6 overflow-hidden">
        <!-- Header desplegable -->
        <div 
          class="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          (click)="toggleFiltros()"
        >
          <h3 class="text-lg font-semibold text-gray-800">Aplicar Filtros</h3>
          <svg 
            class="w-5 h-5 text-gray-600 transition-transform duration-200"
            [class.rotate-180]="mostrarFiltros"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        
        <!-- Contenido desplegable -->
        <div 
          class="transition-all duration-300 ease-in-out"
          [ngClass]="{
            'max-h-0 opacity-0 overflow-hidden': !mostrarFiltros,
            'max-h-screen opacity-100': mostrarFiltros
          }"
        >
          <div class="px-6 pb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          <!-- Filtro por Año -->
          <div>
            <label for="filtroAnio" class="block text-sm font-medium text-gray-700 mb-1">Por Año:</label>
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
            <label for="filtroMes" class="block text-sm font-medium text-gray-700 mb-1">Por Mes:</label>
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
            <label for="filtroPais" class="block text-sm font-medium text-gray-700 mb-1">Por País:</label>
            <select
              id="filtroPais"
              [(ngModel)]="filtros.pais"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 text-sm"
              (change)="aplicarFiltros()"
              [disabled]="isLoadingFiltros"
            >
              <option value="">Todos los países</option>
              <option *ngFor="let opcion of opcionesPaises" [value]="opcion.value">
                {{ opcion.label }}
              </option>
            </select>
          </div>

          <!-- Filtro por Razón Social -->
          <div>
            <label for="filtroRazonSocial" class="block text-sm font-medium text-gray-700 mb-1">Por Razón Social:</label>
            <select
              id="filtroRazonSocial"
              [(ngModel)]="filtros.razon_social"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 text-sm"
              (change)="aplicarFiltros()"
              [disabled]="isLoadingFiltros"
            >
              <option value="">Todas las razones sociales</option>
              <option *ngFor="let opcion of opcionesRazonesSociales" [value]="opcion.value">
                {{ opcion.label }}
              </option>
            </select>
          </div>

          <!-- Filtro por CeCo -->
          <div>
            <label for="filtroCeCo" class="block text-sm font-medium text-gray-700 mb-1">Por CeCo:</label>
            <select
              id="filtroCeCo"
              [(ngModel)]="filtros.ceco"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 text-sm"
              (change)="aplicarFiltros()"
              [disabled]="isLoadingFiltros"
            >
              <option value="">Todos los centros de costo</option>
              <option *ngFor="let opcion of opcionesCeCos" [value]="opcion.value">
                {{ opcion.label }}
              </option>
            </select>
          </div>

          <!-- Filtro por Cuenta -->
          <div>
            <label for="filtroCuenta" class="block text-sm font-medium text-gray-700 mb-1">Por Cuenta:</label>
            <select
              id="filtroCuenta"
              [(ngModel)]="filtros.cuenta"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 text-sm"
              (change)="aplicarFiltros()"
              [disabled]="isLoadingFiltros"
            >
              <option value="">Todas las cuentas</option>
              <option *ngFor="let opcion of opcionesCuentas" [value]="opcion.value">
                {{ opcion.label }}
              </option>
            </select>
          </div>

          <!-- Filtro por Moneda -->
          <div>
            <label for="filtroMoneda" class="block text-sm font-medium text-gray-700 mb-1">Por Moneda:</label>
            <select
              id="filtroMoneda"
              [(ngModel)]="filtros.moneda"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 text-sm"
              (change)="aplicarFiltros()"
              [disabled]="isLoadingFiltros"
            >
              <option value="">Todas las monedas</option>
              <option *ngFor="let opcion of opcionesMonedas" [value]="opcion.value">
                {{ opcion.label }}
              </option>
            </select>
          </div>

          <!-- Botón Buscar - Ocupa el espacio de CeCo y Cuenta (50% del ancho) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
            <button
              class="w-full px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-md shadow transition"
              (click)="cargarDatos()"
              [disabled]="isLoading"
            >
              <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Cargando...' : 'Buscar' }}
            </button>
          </div>

          <!-- Botón Limpiar Filtros - Ocupa el espacio de Moneda y Razón Social (50% del ancho) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
            <button
              class="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md shadow transition"
              (click)="limpiarFiltros()"
            >
              Limpiar Filtros
            </button>
          </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensajes de estado -->
      <div *ngIf="mensaje">
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
  isLoadingFiltros = false;
  mensaje = '';
  mensajeExito = false;
  mostrarFiltros = false; // Controla si los filtros están desplegados o no

  // Opciones para los filtros (cargadas desde APIs)
  opcionesPaises: OpcionFiltro[] = [];
  opcionesRazonesSociales: OpcionFiltro[] = [];
  opcionesCeCos: OpcionFiltro[] = [];
  opcionesCuentas: OpcionFiltro[] = [];
  opcionesMonedas: OpcionFiltro[] = [];

  // Filtros
  filtros: FiltrosVisualizacion = {
    anio: this.actualYear,
    mes: '', // Establecer como string vacío para que seleccione "Todos los meses"
    pais: '',
    razon_social: '',
    ceco: '',
    cuenta: '',
    moneda: ''
  };

  constructor(private gastoVisualizacionService: GastoRealVisualizacionService) {}

  ngOnInit(): void {
    this.cargarOpcionesFiltros();
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarOpcionesFiltros(): void {
    this.isLoadingFiltros = true;

    // Cargar todas las opciones de filtros en paralelo
    forkJoin({
      paises: this.gastoVisualizacionService.obtenerOpcionesPaises(),
      razonesSociales: this.gastoVisualizacionService.obtenerOpcionesRazonesSociales(),
      cecos: this.gastoVisualizacionService.obtenerOpcionesCeCos(),
      cuentas: this.gastoVisualizacionService.obtenerOpcionesCuentas(),
      monedas: this.gastoVisualizacionService.obtenerOpcionesMonedas()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (opciones) => {
        this.opcionesPaises = opciones.paises;
        this.opcionesRazonesSociales = opciones.razonesSociales;
        this.opcionesCeCos = opciones.cecos;
        this.opcionesCuentas = opciones.cuentas;
        this.opcionesMonedas = opciones.monedas;
        this.isLoadingFiltros = false;
      },
      error: (error) => {
        console.error('Error al cargar opciones de filtros:', error);
        this.isLoadingFiltros = false;
        // Usar opciones por defecto en caso de error
        this.cargarOpcionesPorDefecto();
      }
    });
  }

  private cargarOpcionesPorDefecto(): void {
    // Opciones de respaldo en caso de que falle la carga desde API
    this.opcionesPaises = [
      { value: 'Colombia', label: 'Colombia' },
      { value: 'México', label: 'México' },
      { value: 'Perú', label: 'Perú' },
      { value: 'Chile', label: 'Chile' }
    ];
    
    this.opcionesMonedas = [
      { value: 'COP', label: 'COP' },
      { value: 'MXN', label: 'MXN' },
      { value: 'PEN', label: 'PEN' },
      { value: 'CLP', label: 'CLP' },
      { value: 'USD', label: 'USD' }
    ];
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

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limpiarFiltros(): void {
    this.filtros = {
      anio: this.actualYear,
      mes: '', // Mantener consistencia con la inicialización
      pais: '',
      razon_social: '',
      ceco: '',
      cuenta: '',
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