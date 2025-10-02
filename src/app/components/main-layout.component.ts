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
              <a
                class="text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition"
                [routerLink]="getLink('visualizar')"
                routerLinkActive="border-blue-500 text-blue-600 font-semibold border-b-2"
                [routerLinkActiveOptions]="{ exact: true }"
              >Visualizar</a>
              <a
                class="text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition"
                [routerLink]="getLink('importar')"
                routerLinkActive="border-blue-500 text-blue-600 font-semibold border-b-2"
                [routerLinkActiveOptions]="{ exact: true }"
              >Importar</a>
              <a
                class="text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition"
                [routerLink]="getLink('agregar-item')"
                routerLinkActive="border-blue-500 text-blue-600 font-semibold border-b-2"
                [routerLinkActiveOptions]="{ exact: true }"
              >Agregar Ítem</a>
              <a
                class="text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition"
                [routerLink]="getLink('eliminar')"
                routerLinkActive="border-blue-500 text-blue-600 font-semibold border-b-2"
                [routerLinkActiveOptions]="{ exact: true }"
              >Eliminar</a>
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
    // Oculta en ajustes y portal
    if (url.startsWith('/ajustes') || url.startsWith('/portal')) return false;
    // Solo muestra en las rutas permitidas
    return (
      url.startsWith('/plan-anual') ||
      url.startsWith('/gasto-real') ||
      url.startsWith('/confidencial')
    );
  }
}