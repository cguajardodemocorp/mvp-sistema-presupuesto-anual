import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataGridVisualizarComponent } from '../../components/data-grid-visualizar/data-grid-visualizar.component';
import { GastoRealVisualizacionService, GastoRealVisualizacion, FiltrosVisualizacion } from '../../services/gasto-real-visualizacion.service';

@Component({
  selector: 'app-gasto-real-eliminar',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGridVisualizarComponent],
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-10 w-full border border-gray-100">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6">
        Gasto Real - Eliminar - Año {{ actualYear }}
      </h1>

      <!-- Filtro por Mes - Ancho completo con estilo gris -->
      <div class="bg-gray-50 rounded-lg mb-6 p-6">
        <div class="w-full">
          <label for="filtroMes" class="block text-sm font-medium text-gray-700 mb-2">Filtrar por Mes:</label>
          <select
            id="filtroMes"
            [(ngModel)]="filtros.mes"
            (change)="aplicarFiltroMes()"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-sky-200 text-sm"
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
      </div>

      <!-- Grilla de datos - siempre visible -->
      <app-data-grid-visualizar 
        [data]="gastosReales" 
        [tipoGrid]="'gasto-real'"
        [isLoading]="isLoading">
      </app-data-grid-visualizar>

      <!-- Título de eliminación -->
      <div *ngIf="!isLoading && gastosReales.length > 0" class="mt-6 mb-4">
        <h3 class="text-lg font-semibold text-gray-800">
          Eliminar todas las entradas de {{ obtenerTextoMesSeleccionado() }} del {{ actualYear }}
        </h3>
      </div>

      <!-- Mensajes de estado - debajo de la tabla -->
      <div *ngIf="mensaje" class="mb-4">
        <div [ngClass]="mensajeExito ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
             class="rounded px-4 py-2">
          {{ mensaje }}
        </div>
      </div>

      <!-- Checkbox de confirmación -->
      <div *ngIf="!isLoading && gastosReales.length > 0" class="mb-4">
        <label class="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            [(ngModel)]="confirmarEliminacion"
            (change)="onCheckboxChange()"
            class="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          >
          <span class="text-sm text-gray-700">
            Confirmo que deseo Eliminar todas las entradas de gasto real de {{ obtenerTextoMesSeleccionado() }} del {{ actualYear }}
          </span>
        </label>
      </div>

      <!-- Botón de eliminación - aparece solo cuando el checkbox está marcado -->
      <div *ngIf="!isLoading && gastosReales.length > 0 && confirmarEliminacion" class="mb-4">
        <button
          class="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow transition"
          (click)="eliminarEntradas()"
          [disabled]="isLoading"
        >
          🗑️ Eliminar entradas de {{ obtenerTextoMesSeleccionado() }} del {{ actualYear }}
        </button>
      </div>

      <!-- Área preparada para botones de acción adicionales -->
      <div *ngIf="!isLoading && gastosReales.length > 0" class="mt-6 space-y-3">
        <!-- Los botones de acción (eliminar, etc.) se pueden agregar aquí -->
        <!-- Ejemplo de estructura para futuros botones:
        <button
          class="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow transition"
          (click)="accionEjemplo()"
          [disabled]="isLoading"
        >
          Botón de Acción Ejemplo
        </button>
        -->
      </div>

      <!-- Mensaje cuando no hay datos -->
      <div *ngIf="!isLoading && gastosReales.length === 0" 
           class="text-center py-12 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-lg font-medium">No se encontraron gastos reales</p>
        <p class="text-sm mt-1">Selecciona un mes específico para ver los registros disponibles.</p>
      </div>
    </div>
  `
})
export class GastoRealEliminarComponent implements OnInit, OnDestroy {
  actualYear = new Date().getFullYear();
  private destroy$ = new Subject<void>();

  // Datos y estado
  gastosReales: GastoRealVisualizacion[] = []; // Datos que se muestran en la grilla (filtrados)
  gastosOriginales: GastoRealVisualizacion[] = []; // Datos originales sin filtrar
  isLoading = false;
  mensaje = '';
  mensajeExito = false;
  confirmarEliminacion = false; // Checkbox de confirmación

  // Filtros - Solo mes
  filtros: FiltrosVisualizacion = {
    anio: this.actualYear,
    mes: '' // Filtro principal por mes
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

    // Cargar todos los datos sin filtros desde la API (misma API que visualizar)
    this.gastoVisualizacionService.obtenerGastosReales()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (datos) => {
          this.gastosOriginales = datos;
          this.aplicarFiltroMes(); // Aplicar filtro por mes automáticamente
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar gastos reales:', error);
          this.mensaje = 'Error al cargar los datos. Por favor, intenta nuevamente.';
          this.mensajeExito = false;
          this.isLoading = false;
          this.gastosReales = [];
          this.gastosOriginales = [];
        }
      });
  }

  aplicarFiltroMes(): void {
    let datosFiltrados = [...this.gastosOriginales];

    // Aplicar filtro de año (siempre por año actual)
    datosFiltrados = datosFiltrados.filter(gasto => gasto.anio === this.actualYear);

    // Aplicar filtro de mes si está seleccionado
    if (this.filtros.mes && this.filtros.mes !== '') {
      const mesNumero = typeof this.filtros.mes === 'string' ? parseInt(this.filtros.mes) : this.filtros.mes;
      datosFiltrados = datosFiltrados.filter(gasto => gasto.mes === mesNumero);
    }

    // Actualizar los datos que se muestran en la grilla
    this.gastosReales = datosFiltrados;

    // Actualizar mensaje
    this.actualizarMensaje(datosFiltrados.length);
  }

  private obtenerNombreMes(numeroMes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[numeroMes - 1] || '';
  }

  obtenerTextoMesSeleccionado(): string {
    if (this.filtros.mes && this.filtros.mes !== '') {
      const numeroMes = parseInt(this.filtros.mes.toString());
      return this.obtenerNombreMes(numeroMes);
    }
    return 'todos los meses';
  }

  actualizarMensaje(cantidadRegistros: number): void {
    if (cantidadRegistros === 0) {
      const mensajeMes = this.filtros.mes ? ` para el mes seleccionado` : '';
      this.mensaje = `No se encontraron gastos reales${mensajeMes}.`;
      this.mensajeExito = false;
    } else {
      if (this.confirmarEliminacion) {
        // Mensaje de advertencia cuando el checkbox está marcado
        this.mensaje = `⚠️ ¡ATENCIÓN! Esta acción eliminará permanentemente todas las entradas de gasto real para ${this.obtenerTextoMesSeleccionado()} del ${this.actualYear} y no se puede deshacer.`;
        this.mensajeExito = false;
      } else {
        // Mensaje normal de conteo
        const nombreMes = this.filtros.mes ? this.obtenerNombreMes(parseInt(this.filtros.mes.toString())) : '';
        const textoMes = nombreMes ? ` - ${nombreMes} ${this.actualYear}` : ` - Año ${this.actualYear}`;
        this.mensaje = `Se encontraron ${cantidadRegistros} registros${textoMes}.`;
        this.mensajeExito = true;
      }
    }
  }

  onCheckboxChange(): void {
    // Actualizar mensaje cuando cambia el estado del checkbox
    this.actualizarMensaje(this.gastosReales.length);
  }

  eliminarEntradas(): void {
    if (!this.confirmarEliminacion) {
      this.mensaje = 'Debe confirmar la eliminación antes de proceder.';
      this.mensajeExito = false;
      return;
    }

    if (this.gastosReales.length === 0) {
      this.mensaje = 'No hay registros para eliminar.';
      this.mensajeExito = false;
      return;
    }

    // Obtener los IDs de los registros visibles en la tabla filtrada
    const idsAEliminar = this.gastosReales
      .filter(gasto => gasto.id !== undefined && gasto.id !== null)
      .map(gasto => gasto.id!);

    if (idsAEliminar.length === 0) {
      this.mensaje = 'No se encontraron IDs válidos para eliminar.';
      this.mensajeExito = false;
      return;
    }

    // Mostrar mensaje de procesamiento
    this.isLoading = true;
    this.mensaje = `🔄 Eliminando ${idsAEliminar.length} registros de ${this.obtenerTextoMesSeleccionado()} del ${this.actualYear}...`;
    this.mensajeExito = false;

    console.log('Eliminando IDs:', idsAEliminar);

    // Llamar al servicio para eliminar múltiples registros
    this.gastoVisualizacionService.eliminarMultiplesGastosReales(idsAEliminar)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resultados) => {
          console.log('Resultados de eliminación:', resultados);
          
          // Mensaje de éxito
          this.mensaje = `✅ Se eliminaron exitosamente ${idsAEliminar.length} registros de ${this.obtenerTextoMesSeleccionado()} del ${this.actualYear}.`;
          this.mensajeExito = true;
          
          // Resetear el checkbox
          this.confirmarEliminacion = false;
          
          // Recargar los datos para actualizar la vista
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error al eliminar registros:', error);
          
          // Mensaje de error
          this.mensaje = `❌ Error al eliminar los registros. Por favor, intenta nuevamente.`;
          this.mensajeExito = false;
          this.isLoading = false;
        }
      });
  }

  // Métodos preparados para futuras funcionalidades de eliminación o otras acciones
  // Ejemplo de método que se puede implementar para eliminar registros
  /*
  eliminarRegistrosSeleccionados(): void {
    // Implementar lógica de eliminación
    // Consumir API de eliminación diferente
    console.log('Eliminar registros seleccionados');
  }

  confirmarEliminacion(): void {
    // Implementar confirmación de eliminación
    console.log('Confirmar eliminación');
  }
  */
}