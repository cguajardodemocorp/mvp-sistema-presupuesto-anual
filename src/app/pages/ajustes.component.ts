import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajustes-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Ajustes</h1>
      <p>Contenido personalizado para la página Ajustes.</p>
    </div>
  `
})
export class AjustesPageComponent {}