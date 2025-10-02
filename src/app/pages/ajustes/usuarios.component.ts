import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajustes-usuarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Usuarios</h2>
      <p>Aquí puedes gestionar los usuarios de la configuración.</p>
    </div>
  `
})
export class AjustesUsuariosComponent {}