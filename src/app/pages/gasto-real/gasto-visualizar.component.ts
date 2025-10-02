import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gasto-real-visualizar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Visualizar Gasto Real</h2>
      <p>Aquí puedes visualizar el gasto real.</p>
    </div>
  `
})
export class GastoRealVisualizarComponent {}