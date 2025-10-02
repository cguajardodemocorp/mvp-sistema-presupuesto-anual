import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-anual-eliminar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Eliminar Ítem del Plan Anual</h2>
      <p>Aquí puedes eliminar un ítem del plan anual.</p>
    </div>
  `
})
export class PlanAnualEliminarComponent {}