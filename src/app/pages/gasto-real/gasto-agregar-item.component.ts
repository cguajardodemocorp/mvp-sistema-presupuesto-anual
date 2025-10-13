import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { GastoRealVisualizacionService, OpcionFiltro } from '../../services/gasto-real-visualizacion.service';

export interface NuevoGastoReal {
  pais: string;
  razon_social: string;
  cuenta: string;
  ceco: string;
  monto: number | null;
  moneda: string;
  mes: number | null;
  glosa: string;
}

@Component({
  selector: 'app-gasto-real-agregar-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-10 w-full border border-gray-100">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6">
        Agregar Ítem a Gasto Real
      </h1>

      <!-- Formulario -->
      <form (ngSubmit)="agregarItem()" #formulario="ngForm" class="space-y-6">
        
        <!-- Primera fila: País y Razón Social -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- País -->
          <div>
            <label for="pais" class="block text-sm font-medium text-gray-700 mb-2">País *</label>
            <select
              id="pais"
              name="pais"
              [(ngModel)]="nuevoGasto.pais"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-300 text-sm"
              [disabled]="isLoadingOpciones"
            >
              <option value="">Seleccione un país</option>
              <option *ngFor="let opcion of opcionesPaises" [value]="opcion.value">
                {{ opcion.label }}
              </option>
            </select>
          </div>

          <!-- Razón Social -->
          <div>
            <label for="razonSocial" class="block text-sm font-medium text-gray-700 mb-2">Razón Social *</label>
            <select
              id="razonSocial"
              name="razonSocial"
              [(ngModel)]="nuevoGasto.razon_social"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-300 text-sm"
              [disabled]="isLoadingOpciones"
            >
              <option value="">Seleccione una razón social</option>
              <option *ngFor="let opcion of opcionesRazonesSociales" [value]="opcion.value">
                {{ opcion.label }}
              </option>
            </select>
          </div>

        </div>

        <!-- Segunda fila: Cuenta y CeCo -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Cuenta -->
          <div>
            <label for="cuenta" class="block text-sm font-medium text-gray-700 mb-2">Cuenta *</label>
            <select
              id="cuenta"
              name="cuenta"
              [(ngModel)]="nuevoGasto.cuenta"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-300 text-sm"
              [disabled]="isLoadingOpciones"
            >
              <option value="">Seleccione una cuenta</option>
              <option *ngFor="let opcion of opcionesCuentas" [value]="opcion.value">
                {{ opcion.label }}
              </option>
            </select>
          </div>

          <!-- CeCo -->
          <div>
            <label for="ceco" class="block text-sm font-medium text-gray-700 mb-2">CeCo *</label>
            <select
              id="ceco"
              name="ceco"
              [(ngModel)]="nuevoGasto.ceco"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-300 text-sm"
              [disabled]="isLoadingOpciones"
            >
              <option value="">Seleccione un CeCo</option>
              <option *ngFor="let opcion of opcionesCeCos" [value]="opcion.value">
                {{ opcion.label }}
              </option>
            </select>
          </div>

        </div>

        <!-- Tercera fila: Monto y Moneda -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Monto -->
          <div>
            <label for="monto" class="block text-sm font-medium text-gray-700 mb-2">Monto *</label>
            <input
              type="number"
              id="monto"
              name="monto"
              [(ngModel)]="nuevoGasto.monto"
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-300 text-sm"
            >
          </div>

          <!-- Moneda -->
          <div>
            <label for="moneda" class="block text-sm font-medium text-gray-700 mb-2">Moneda *</label>
            <select
              id="moneda"
              name="moneda"
              [(ngModel)]="nuevoGasto.moneda"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-300 text-sm"
              [disabled]="isLoadingOpciones"
            >
              <option value="">Seleccione una moneda</option>
              <option *ngFor="let opcion of opcionesMonedas" [value]="opcion.value">
                {{ opcion.label }}
              </option>
            </select>
          </div>

        </div>

        <!-- Cuarta fila: Mes del gasto -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Mes del gasto -->
          <div>
            <label for="mes" class="block text-sm font-medium text-gray-700 mb-2">Mes del Gasto *</label>
            <select
              id="mes"
              name="mes"
              [(ngModel)]="nuevoGasto.mes"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-300 text-sm"
            >
              <option value="">Seleccione el mes</option>
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

        </div>

        <!-- Quinta fila: Glosa -->
        <div>
          <label for="glosa" class="block text-sm font-medium text-gray-700 mb-2">Glosa</label>
          <textarea
            id="glosa"
            name="glosa"
            [(ngModel)]="nuevoGasto.glosa"
            rows="3"
            placeholder="Descripción del gasto (opcional)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 focus:border-sky-300 text-sm resize-none"
          ></textarea>
        </div>

        <!-- Botón de agregar -->
        <div class="pt-4">
          <button
            type="submit"
            [disabled]="!formulario.form.valid || isLoading"
            class="w-full px-4 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md shadow transition"
          >
            <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Agregando...' : 'Agregar item a gasto real' }}
          </button>
        </div>

      </form>

      <!-- Notificador de validaciones -->
      <div *ngIf="mensajeValidacion" class="mt-4">
        <div [ngClass]="mensajeExito ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
             class="rounded px-4 py-3 border">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg *ngIf="mensajeExito" class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <svg *ngIf="!mensajeExito" class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium">{{ mensajeValidacion }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class GastoRealAgregarItemComponent implements OnInit, OnDestroy {
  actualYear = new Date().getFullYear();
  private destroy$ = new Subject<void>();

  // Datos del formulario
  nuevoGasto: NuevoGastoReal = {
    pais: '',
    razon_social: '',
    cuenta: '',
    ceco: '',
    monto: null,
    moneda: '',
    mes: null,
    glosa: ''
  };

  // Estados
  isLoading = false;
  isLoadingOpciones = false;
  mensajeValidacion = '';
  mensajeExito = false;

  // Opciones para los selectores
  opcionesPaises: OpcionFiltro[] = [];
  opcionesRazonesSociales: OpcionFiltro[] = [];
  opcionesCuentas: OpcionFiltro[] = [];
  opcionesCeCos: OpcionFiltro[] = [];
  opcionesMonedas: OpcionFiltro[] = [];

  constructor(private gastoVisualizacionService: GastoRealVisualizacionService) {}

  ngOnInit(): void {
    this.cargarOpcionesFiltros();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarOpcionesFiltros(): void {
    this.isLoadingOpciones = true;

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
        this.isLoadingOpciones = false;
      },
      error: (error) => {
        console.error('Error al cargar opciones:', error);
        this.isLoadingOpciones = false;
        this.mostrarMensaje('Error al cargar las opciones del formulario.', false);
      }
    });
  }

  agregarItem(): void {
    // Validaciones personalizadas
    if (!this.validarFormulario()) {
      return;
    }

    this.isLoading = true;
    this.mensajeValidacion = '';

    // Preparar datos para la API
    const gastoData = {
      pais: this.nuevoGasto.pais,
      razon_social: this.nuevoGasto.razon_social,
      ceco: this.nuevoGasto.ceco,
      cuenta: this.nuevoGasto.cuenta,
      monto: this.nuevoGasto.monto,
      moneda: this.nuevoGasto.moneda,
      glosa: this.nuevoGasto.glosa || '',
      anio: this.actualYear,
      mes: parseInt(this.nuevoGasto.mes?.toString() || '0'), // Parsear a entero
      usuario_id: 1, // Valor fijo
      fecha_carga: this.obtenerFechaActual() // Fecha y hora actual del sistema
    };

    console.log('Enviando datos a la API:', gastoData);

    // Llamar a la API para crear el gasto real
    this.gastoVisualizacionService.crearGastoReal(gastoData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
          this.mostrarMensaje('✅ Item agregado exitosamente a gasto real.', true);
          this.limpiarFormulario();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al agregar item:', error);
          this.mostrarMensaje('❌ Error al agregar el item. Por favor, intenta nuevamente.', false);
          this.isLoading = false;
        }
      });
  }

  validarFormulario(): boolean {
    // Validar monto
    if (!this.nuevoGasto.monto || this.nuevoGasto.monto <= 0) {
      this.mostrarMensaje('Monto debe ser mayor a 0', false);
      return false;
    }

    // Validar campos requeridos
    const camposRequeridos = [
      { campo: 'pais', nombre: 'País' },
      { campo: 'razon_social', nombre: 'Razón Social' },
      { campo: 'cuenta', nombre: 'Cuenta' },
      { campo: 'ceco', nombre: 'CeCo' },
      { campo: 'moneda', nombre: 'Moneda' },
      { campo: 'mes', nombre: 'Mes del Gasto' }
    ];

    for (const { campo, nombre } of camposRequeridos) {
      const valor = (this.nuevoGasto as any)[campo];
      if (!valor || valor === '') {
        this.mostrarMensaje(`${nombre} es requerido`, false);
        return false;
      }
    }

    return true;
  }

  mostrarMensaje(mensaje: string, esExito: boolean): void {
    this.mensajeValidacion = mensaje;
    this.mensajeExito = esExito;
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      this.mensajeValidacion = '';
    }, 5000);
  }

  limpiarFormulario(): void {
    this.nuevoGasto = {
      pais: '',
      razon_social: '',
      cuenta: '',
      ceco: '',
      monto: null,
      moneda: '',
      mes: null,
      glosa: ''
    };
  }

  obtenerFechaActual(): string {
    // Obtener fecha y hora actual del sistema en formato: "YYYY-MM-DD HH:MM:SS"
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}