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
      <h1 class="text-3xl font-extrabold text-gray-800 mb-2">Importar Gastos Reales para el Año 2025</h1>
      <p class="text-gray-600 mb-6">Los gastos se agruparán para el 2025 y el mes seleccionado. Columnas requeridas:
        <span class="text-sky-700 font-semibold">País, Razón Social, Cuenta, CeCo, Moneda, Monto, Glosa</span>
      </p>
      <button class="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg mb-8 text-base shadow transition" (click)="downloadTemplate.emit()">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Descargar plantilla de importación
      </button>
      <div class="mb-8">
        <label for="month" class="block font-semibold text-gray-700 mb-2">Mes para los gastos:</label>
        <select id="month" [(ngModel)]="selectedMonth" class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-200 text-lg">
          <option value="01">01 / 2025 (Enero)</option>
          <option value="02">02 / 2025 (Febrero)</option>
          <option value="03">03 / 2025 (Marzo)</option>
          <option value="04">04 / 2025 (Abril)</option>
          <option value="05">05 / 2025 (Mayo)</option>
          <option value="06">06 / 2025 (Junio)</option>
          <option value="07">07 / 2025 (Julio)</option>
          <option value="08">08 / 2025 (Agosto)</option>
          <option value="09">09 / 2025 (Septiembre)</option>
          <option value="10">10 / 2025 (Octubre)</option>
          <option value="11">11 / 2025 (Noviembre)</option>
          <option value="12">12 / 2025 (Diciembre)</option>
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