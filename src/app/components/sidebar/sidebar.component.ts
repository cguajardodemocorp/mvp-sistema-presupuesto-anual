import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Corrige: Importa Router en vez de Routes

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="w-[280px] h-screen bg-sky-600 text-white flex flex-col fixed left-0 top-0 z-50">
      <div class="flex-1 p-6 flex flex-col">
        <div class="mb-10">
          <h3 class="text-base font-semibold leading-tight">Plataforma de Consolidación</h3>
          <p class="text-base font-bold leading-tight">de Planificación y Control Presupuestario</p>
        </div>
        <nav>
          <h4 class="text-sm font-semibold mb-1">Menú</h4>
          <p class="text-xs mb-4 opacity-80">Selecciona el Módulo</p>
          <form class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="modulo" value="Portal" class="accent-sky-500"
                [checked]="selected === 'portal'"
                (change)="navigate('portal')">
              <span [ngClass]="{'font-bold': selected === 'portal'}">Portal</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="modulo" value="Plan Anual" class="accent-sky-500"
                [checked]="selected === 'plan-anual'"
                (change)="navigate('plan-anual')">
              <span [ngClass]="{'font-bold': selected === 'plan-anual'}">Plan Anual</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="modulo" value="Gasto Real" class="accent-sky-500"
                [checked]="selected === 'gasto-real'"
                (change)="navigate('gasto-real')">
              <span [ngClass]="{'font-bold': selected === 'gasto-real'}">Gasto Real</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="modulo" value="Confidencial" class="accent-sky-500"
                [checked]="selected === 'confidencial'"
                (change)="navigate('confidencial')">
              <span [ngClass]="{'font-bold': selected === 'confidencial'}">Confidencial</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="modulo" value="Ajustes" class="accent-sky-500"
                [checked]="selected === 'ajustes'"
                (change)="navigate('ajustes')">
              <span [ngClass]="{'font-bold': selected === 'ajustes'}">Ajustes</span>
            </label>
          </form>
        </nav>
      </div>
      <div class="p-6 mt-auto flex items-center justify-center">
        <img src="assets/democorp-logo.png" alt="DEMOCORP logo" class="max-h-16 w-auto" />
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100vh;
      background: linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%);
      color: white;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .sidebar-content {
      flex: 1;
      padding: 20px;
    }

    .platform-info {
      margin-bottom: 40px;
    }

    .platform-info h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
      opacity: 0.9;
    }

    .platform-info p {
      font-size: 14px;
      opacity: 0.8;
      line-height: 1.4;
    }

    .sidebar-nav h4 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .nav-subtitle {
      font-size: 12px;
      opacity: 0.7;
      margin-bottom: 20px;
    }

    .nav-list {
      list-style: none;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      font-size: 14px;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .nav-item:hover {
      opacity: 0.8;
    }

    .nav-item.active {
      font-weight: 600;
    }

    .nav-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transition: background 0.2s;
    }

    .nav-dot.active {
      background: white;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        height: auto;
        position: relative;
      }
    }
  `]
})
export class SidebarComponent {
  selected = 'portal';
  constructor(private router: Router) {}

  navigate(modulo: string) {
    this.selected = modulo;
    this.router.navigate([modulo]);
  }
}

// Elimina las declaraciones de rutas y los imports innecesarios.
// Los componentes de página deben estar en archivos separados.
// Si necesitas el PortalPageComponent aquí, solo déjalo así:
@Component({
  selector: 'app-portal-page',
  template: `<div class="p-8 text-3xl font-bold">Portal</div>`
})
export class PortalPageComponent {}