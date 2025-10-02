import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gasto-real-eliminar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Eliminar Ítem de Gasto Real</h2>
      <p>Aquí puedes eliminar un ítem de gasto real.</p>
    </div>
  `
})
export class GastoRealEliminarComponent {}