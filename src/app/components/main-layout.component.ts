import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, SidebarComponent], // Agrega RouterModule para routerLink
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <app-sidebar></app-sidebar>
      <div class="flex-1 flex flex-col ml-[280px]">
        <!-- Header de navegación (oculto en /portal) -->
          <header class="bg-white shadow flex items-center px-8 h-16 sticky top-0 z-20">
              <nav class="flex gap-8" *ngIf="mostrarLinks">
                <!-- Pestañas para ajustes -->
                <ng-container *ngIf="isAjustes; else defaultTabs">
                  <a
                    [routerLink]="'/ajustes/datos-validos'"
                    [ngClass]="isActiveAjustesLink('/ajustes/datos-validos') ? 'text-blue-600 font-semibold border-blue-500 border-b-2' : 'text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition'"
                  >Datos Válidos</a>
                  <a
                    [routerLink]="'/ajustes/tasas-monetarias'"
                    [ngClass]="isActiveAjustesLink('/ajustes/tasas-monetarias') ? 'text-blue-600 font-semibold border-blue-500 border-b-2' : 'text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition'"
                  >Tasas Monetarias</a>
                  <a
                    [routerLink]="'/ajustes/usuarios'"
                    [ngClass]="isActiveAjustesLink('/ajustes/usuarios') ? 'text-blue-600 font-semibold border-blue-500 border-b-2' : 'text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition'"
                  >Usuarios</a>
                </ng-container>
                <!-- Pestañas por defecto -->
                <ng-template #defaultTabs>
                  <a
                    [routerLink]="getLink('visualizar')"
                    [ngClass]="isActiveLink('visualizar') ? 'text-blue-600 font-semibold border-blue-500 border-b-2' : 'text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition'"
                  >Visualizar</a>
                  <a
                    [routerLink]="getLink('importar')"
                    [ngClass]="isActiveLink('importar') ? 'text-blue-600 font-semibold border-blue-500 border-b-2' : 'text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition'"
                  >Importar</a>
                  <a
                    [routerLink]="getLink('agregar-item')"
                    [ngClass]="isActiveLink('agregar-item') ? 'text-blue-600 font-semibold border-blue-500 border-b-2' : 'text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition'"
                  >Agregar Ítem</a>
                  <a
                    [routerLink]="getLink('eliminar')"
                    [ngClass]="isActiveLink('eliminar') ? 'text-blue-600 font-semibold border-blue-500 border-b-2' : 'text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition'"
                  >Eliminar</a>
                </ng-template>
              </nav>
            <div class="ml-auto flex items-center gap-4">
              <button class="relative text-gray-400 hover:text-blue-500">
                <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </button>
              <div class="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">U</div>
            </div>
          </header>
        <main class="flex-1 p-8 max-w-6xl w-full mx-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  constructor(public router: Router) {}

  // Obtiene el prefijo de ruta actual para los links
  get currentPrefix(): string {
    const url = this.router.url;
    if (url.startsWith('/plan-anual')) return '/plan-anual';
    if (url.startsWith('/gasto-real')) return '/gasto-real';
    if (url.startsWith('/confidencial')) return '/confidencial';
    return '/plan-anual'; // Por defecto
  }

  getLink(action: string): string {
    return `${this.currentPrefix}/${action}`;
  }

  get mostrarLinks(): boolean {
    const url = this.router.url;
    // Oculta solo en portal
    if (url.startsWith('/portal')) return false;
    // Muestra en ajustes y en las rutas permitidas
    return (
      url.startsWith('/plan-anual') ||
      url.startsWith('/gasto-real') ||
      url.startsWith('/confidencial') ||
      url.startsWith('/ajustes')
    );
  }

  get isAjustes(): boolean {
    return this.router.url.startsWith('/ajustes');
  }

  isActiveAjustesLink(path: string): boolean {
    return this.router.url === path;
  }
  isActiveLink(action: string): boolean {
    const url = this.router.url;
    return url === this.getLink(action);
  }
}