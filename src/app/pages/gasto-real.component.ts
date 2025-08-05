import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gasto-real-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Gasto Real</h1>
      <p>Contenido personalizado para la página Gasto Real.</p>
    </div>
  `
})
export class GastoRealPageComponent {}