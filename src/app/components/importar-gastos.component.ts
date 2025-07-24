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
    <div class="bg-white rounded-2xl shadow-lg p-10 w-full max-w-3xl mx-auto mt-8 border border-gray-100">
      <h1 class="text-3xl font-extrabold text-gray-800 mb-2">Importar Plan Anual - Año 2025</h1>
      <p class="text-gray-600 mb-6">
        <b>Instrucciones:</b> EL plan se importará para el año <b>2025</b>. Para Realizar la importación del plan anual de presupuesto, primero debes descargar la <b>plantilla oficial</b>, la cual contiene los valores predeterminados y el formato correcto. Solo se admiten archivos en format <b>.xlsx</b> o <b>.xls</b>.
       
      </p>
      <button class="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg mb-8 text-base shadow transition" (click)="downloadTemplate.emit()">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Descargar plantilla de importación
      </button>
      <div class="mb-8">
        <select id="month" [(ngModel)]="selectedMonth" class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-200 text-lg">
          <option value="01">Tasas de Conversión de Referencia para el año 2025 </option>
        </select>
      </div>
      <label for="month" class="block font-semibold text-gray-700 mb-2">Año para el plan: </label>
      <div class="mb-8">
        <select
          id="month"
          [(ngModel)]="selectedMonth"
          class="w-full px-4 py-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-200 text-lg"
        >
          <option value="01"> 2025 </option>
          <option value="02"> 2024 </option>
        </select>
      </div>
      <div class="mb-8">
        <h3 class="font-semibold text-gray-800 mb-2">Cargar Excel de Gastos Reales</h3>
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
      <app-data-grid [data]="excelData"></app-data-grid>
    </div>
  `
})
export class ImportarGastosComponent {
  @Input() selectedMonth: string = '01';
  @Input() isLoading: boolean = false;
  @Input() uploadMessage: string = '';
  @Input() uploadSuccess: boolean = false;
  @Input() validationErrors: string[] = [];
  @Input() excelData: any[] = [];

  @Output() downloadTemplate = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();
}