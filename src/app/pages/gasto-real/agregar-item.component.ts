import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gasto-real-agregar-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Agregar Ítem a Gasto Real</h2>
      <p>Aquí puedes agregar un ítem a gasto real.</p>
    </div>
  `
})
export class GastoRealAgregarItemComponent {}