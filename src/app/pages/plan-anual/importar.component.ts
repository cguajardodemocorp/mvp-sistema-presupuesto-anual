import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-anual-importar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Importar Plan Anual</h2>
      <p>Aquí puedes importar datos al plan anual.</p>
    </div>
  `
})
export class PlanAnualImportarComponent {}