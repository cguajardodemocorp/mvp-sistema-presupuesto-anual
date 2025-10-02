import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajustes-tasas-monetarias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Tasas Monetarias</h2>
      <p>Aquí puedes gestionar las tasas monetarias de la configuración.</p>
    </div>
  `
})
export class AjustesTasasMonetariasComponent {}