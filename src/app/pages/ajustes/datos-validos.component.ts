import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajustes-datos-validos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Datos válidos</h2>
      <p>Aquí puedes gestionar los datos válidos de la configuración.</p>
    </div>
  `
})
export class AjustesDatosValidosComponent {}