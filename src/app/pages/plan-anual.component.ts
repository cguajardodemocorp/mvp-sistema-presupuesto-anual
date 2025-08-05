import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-anual-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Plan Anual</h1>
      <p>Contenido personalizado para la página Plan Anual.</p>
    </div>
  `
})
export class PlanAnualPageComponent {}