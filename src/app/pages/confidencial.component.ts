import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confidencial-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Confidencial</h1>
      <p>Contenido personalizado para la página Confidencial.</p>
    </div>
  `
})
export class ConfidencialPageComponent {}