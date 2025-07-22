import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <div class="border-2 border-dashed border-sky-300 bg-blue-50 rounded-xl min-h-[200px] flex flex-col items-center justify-center gap-4 px-4 py-8 cursor-pointer transition hover:border-sky-500 relative" [class.opacity-60]="isLoading"
        (click)="fileInput.click()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)">
        <div class="flex flex-col items-center">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-sky-400 mb-2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10,9 9,9 8,9"></polyline>
          </svg>
          <p class="font-semibold text-lg text-sky-700">Drag and drop file here</p>
          <p class="text-gray-500 text-sm">Limit 200MB per file • XLS, XLSX</p>
        </div>
        <input #fileInput type="file" class="hidden" accept=".xlsx,.xls" (change)="onFileSelected($event)">
        <button type="button" class="absolute bottom-4 right-4 bg-white border border-sky-300 text-sky-700 font-semibold px-4 py-2 rounded shadow hover:bg-sky-50 transition" [disabled]="isLoading">
          {{ isLoading ? 'Procesando...' : 'Buscar Archivo' }}
        </button>
      </div>
      <div *ngIf="selectedFile" class="mt-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-4 py-2">
        <div class="flex items-center gap-2 text-gray-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
          </svg>
          <span class="font-medium">{{ selectedFile.name }}</span>
          <span class="text-gray-500 text-xs">{{ formatFileSize(selectedFile.size) }}</span>
        </div>
        <button type="button" class="text-gray-400 hover:text-red-500" (click)="removeFile()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .file-upload-container {
      width: 100%;
    }

    .upload-area {
      border: 2px dashed var(--gray-300);
      border-radius: 8px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--white);
      min-height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .upload-area:hover {
      border-color: var(--primary-blue);
      background: var(--light-blue);
    }

    .upload-area.dragover {
      border-color: var(--primary-blue);
      background: var(--light-blue);
      transform: scale(1.02);
    }

    .upload-area.error {
      border-color: var(--error);
      background: #fef2f2;
    }

    .upload-icon {
      color: var(--gray-400);
      transition: color 0.3s;
    }

    .upload-area:hover .upload-icon,
    .upload-area.dragover .upload-icon {
      color: var(--primary-blue);
    }

    .upload-text {
      color: var(--gray-600);
    }

    .main-text {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .sub-text {
      font-size: 14px;
      color: var(--gray-500);
    }

    .browse-btn {
      background: var(--primary-blue);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .browse-btn:hover:not(:disabled) {
      background: var(--dark-blue);
    }

    .browse-btn:disabled {
      background: var(--gray-400);
      cursor: not-allowed;
    }

    .selected-file {
      margin-top: 16px;
      padding: 12px 16px;
      background: var(--gray-100);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--gray-700);
    }

    .file-name {
      font-weight: 500;
    }

    .file-size {
      color: var(--gray-500);
      font-size: 14px;
    }

    .remove-btn {
      background: none;
      border: none;
      color: var(--gray-500);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .remove-btn:hover {
      background: var(--gray-200);
      color: var(--error);
    }
  `]
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();
  @Input() isLoading = false;
  
  selectedFile: File | null = null;
  isDragOver = false;
  hasError = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    this.selectedFile = file;
    this.hasError = false;
    this.fileSelected.emit(file);
  }

  removeFile(): void {
    this.selectedFile = null;
    this.hasError = false;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}