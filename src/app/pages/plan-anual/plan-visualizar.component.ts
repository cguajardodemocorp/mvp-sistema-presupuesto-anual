import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-anual-visualizar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Visualizar Plan Anual</h2>
      <p>Aquí puedes visualizar el plan anual.</p>
    </div>
  `
})
export class PlanAnualVisualizarComponent {}