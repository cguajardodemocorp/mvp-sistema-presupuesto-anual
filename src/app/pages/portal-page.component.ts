import { Component } from '@angular/core';

@Component({
  selector: 'app-portal-page',
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold mb-4">Bienvenido al Portal</h1>
      <p class="text-lg text-gray-700 mb-6">
        Aquí puedes visualizar el resumen general del sistema, acceder a reportes y navegar por los módulos principales.
      </p>
      <!-- Agrega aquí cualquier contenido extra que necesites -->
    </div>
  `
})
export class PortalPageComponent {}