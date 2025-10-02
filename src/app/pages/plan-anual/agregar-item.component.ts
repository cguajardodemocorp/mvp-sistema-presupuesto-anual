import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-anual-agregar-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Agregar Ítem al Plan Anual</h2>
      <p>Aquí puedes agregar un ítem al plan anual.</p>
    </div>
  `
})
export class PlanAnualAgregarItemComponent {}