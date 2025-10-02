import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confidencial-agregar-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Agregar Ítem a Confidencial</h2>
      <p>Aquí puedes agregar un ítem a la información confidencial.</p>
    </div>
  `
})
export class ConfidencialAgregarItemComponent {}