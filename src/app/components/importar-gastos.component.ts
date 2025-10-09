import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { DataGridComponent } from './data-grid/data-grid.component';

@Component({
  selector: 'app-importar-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent, DataGridComponent],
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-10 w-full border border-gray-100">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2" [innerHTML]="tituloHtml || titulo"></h1>
      <p class="text-gray-600 mb-6 text-sm sm:text-base">
        <b>Instrucciones:</b> <span [innerHTML]="instruccionesHtml || instrucciones"></span>
      </p>
      <button
        class="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg mb-8 text-base shadow transition"
        (click)="onDownloadTemplate()"
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        {{ textoBoton }}
      </button>
      <div class="mb-4 text-gray-700 text-sm">
        <ul class="list-disc ml-6 mt-2">
          <li *ngFor="let punto of bulletPoints">{{ punto }}</li>
        </ul>
      </div>
      
      <!-- Selector de Tasas de Conversión (condicional) -->
      <div class="mb-8" *ngIf="mostrarTasasConversion">
        <select id="month" [(ngModel)]="selectedMonth" class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-200 text-base sm:text-lg">
          <option value="01">Tasas de Conversión de Referencia para el año 2025 </option>
        </select>
      </div>
      
      <!-- Selector de Año (condicional) -->
      <div *ngIf="mostrarSelectorAno">
        <label for="year" class="block font-semibold text-gray-700 mb-2">Año para el plan: </label>
        <div class="mb-8">
          <select
            id="year"
            [(ngModel)]="yearSeleccionado"
            class="w-full px-4 py-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-200 text-base sm:text-lg"
          >
            <option *ngFor="let opcion of opcionesAno" [value]="opcion.value">{{ opcion.label }}</option>
          </select>
        </div>
      </div>
      
      <!-- Selector de Mes (condicional) -->
      <div class="mb-8" *ngIf="mostrarSelectorMes && tipoArchivo === 'gasto-real'">
        <label for="mes" class="block font-semibold text-gray-700 mb-2">Mes de los gastos reales:</label>
        <select
          id="mes"
          [(ngModel)]="selectedMonth"
          class="w-full px-4 py-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-200 text-base sm:text-lg"
        >
          <option value="01">Enero</option>
          <option value="02">Febrero</option>
          <option value="03">Marzo</option>
          <option value="04">Abril</option>
          <option value="05">Mayo</option>
          <option value="06">Junio</option>
          <option value="07">Julio</option>
          <option value="08">Agosto</option>
          <option value="09">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
      </div>
      
      <div class="mb-8">
        <h3 class="font-semibold text-gray-800 mb-2">{{ labelCargaArchivo }}</h3>
        <app-file-upload (fileSelected)="fileSelected.emit($event)" [isLoading]="isLoading"></app-file-upload>
      </div>
      <div *ngIf="uploadMessage" class="mb-4">
        <div [ngClass]="uploadSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="rounded px-4 py-2">
          {{ uploadMessage }}
        </div>
      </div>
      <div *ngIf="validationErrors && validationErrors.length > 0" class="mb-4">
        <div class="bg-yellow-100 text-yellow-800 rounded px-4 py-2">
          <strong>Errores de validación:</strong>
          <ul class="list-disc ml-6">
            <li *ngFor="let error of validationErrors">{{ error }}</li>
          </ul>
        </div>
      </div>
      <app-data-grid [data]="excelData" [tipoGrid]="tipoArchivo"></app-data-grid>
    </div>
  `
})
export class ImportarGastosComponent {
  @Input() selectedYear: string = '01';
  yearSeleccionado: string = '';

  ngOnInit() {
    // Inicializa el selector de año con '01' o el primer valor disponible
    this.yearSeleccionado = this.selectedYear || (this.opcionesAno.length ? this.opcionesAno[0].value : '');
  }
  @Input() tituloHtml?: string;
  @Input() instruccionesHtml?: string;
  @Input() titulo: string = 'Importar Plan Anual - Año 2025';
  @Input() instrucciones: string = 'EL plan se importará para el año 2025. Para realizar la importación del plan anual de presupuesto, primero debes descargar la plantilla oficial, la cual contiene los valores predeterminados y el formato correcto. Solo se admiten archivos en format .xlsx o .xls.';
  @Input() textoBoton: string = 'Descargar plantilla de importación';
  @Input() bulletPoints: string[] = [
    'El archivo debe contener las columnas obligatorias',
    'Solo se permiten valores válidos'
  ];
  @Input() selectedMonth: string = '01';
  @Input() isLoading: boolean = false;
  @Input() uploadMessage: string = '';
  @Input() uploadSuccess: boolean = false;
  @Input() validationErrors: string[] = [];
  @Input() excelData: any[] = [];
  
  // Nuevos inputs para mayor configurabilidad
  @Input() mostrarSelectorMes: boolean = true;
  @Input() mostrarSelectorAno: boolean = true;
  @Input() mostrarTasasConversion: boolean = true;
  @Input() labelCargaArchivo: string = 'Cargar Excel de Gastos Reales';
  @Input() tipoArchivo: 'plan-anual' | 'gasto-real' | 'otro' = 'plan-anual';
  @Input() opcionesAno: Array<{value: string, label: string}> = [
    { value: '01', label: '2025' },
    { value: '02', label: '2024' }
  ];


  @Output() downloadTemplate = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();
  @Input() onDownloadTemplate: () => void = () => {};
}