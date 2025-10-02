import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portal-page',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="p-8 flex flex-col items-center">
        <div class="flex justify-center mt-10 mb-6 md:mt-16">
          <img src="assets/democorp_isotipo_azul_sin_fondo.png" alt="Democorp Isotipo" class="h-40 md:h-56 w-auto max-w-full" />
        </div>
        <div class="max-w-xl w-full mx-auto text-center">
          <h1 class="text-xl md:text-2xl font-bold mb-4">¡Bienvenido a la Plataforma de Consolidación
          de <b>Planificación y Control Presupuestario</b>!</h1>
          <p class="text-base md:text-lg">Esta herramienta ha sido diseñada para centralizar, optimizar y dar seguimiento a los procesos de planificación financiera y control presupuestario de manera eficiente, segura y colaborativa.</p>
        </div>
      </div>
  `
})
export class PortalPageComponent { }