import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confidencial-visualizar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Visualizar Confidencial</h2>
      <p>Aquí puedes visualizar la información confidencial.</p>
    </div>
  `
})
export class ConfidencialVisualizarComponent {}