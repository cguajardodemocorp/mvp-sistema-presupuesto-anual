import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confidencial-importar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Importar Confidencial</h2>
      <p>Aquí puedes importar información confidencial.</p>
    </div>
  `
})
export class ConfidencialImportarComponent {}