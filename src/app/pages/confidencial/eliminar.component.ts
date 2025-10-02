import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confidencial-eliminar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Eliminar Ítem de Confidencial</h2>
      <p>Aquí puedes eliminar un ítem de la información confidencial.</p>
    </div>
  `
})
export class ConfidencialEliminarComponent {}