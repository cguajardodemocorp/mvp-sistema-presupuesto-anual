import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portal-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Portal</h1>
      <p>Bienvenido al portal principal.</p>
    </div>
  `
})
export class PortalPageComponent {}