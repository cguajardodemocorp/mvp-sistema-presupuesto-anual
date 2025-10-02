import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent], // Agrega SidebarComponent aquí
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <app-sidebar></app-sidebar>
      <div class="flex-1 flex flex-col ml-[280px]">
        <!-- Header de navegación (oculto en /portal) -->
          <header *ngIf="mostrarHeader" class="bg-white shadow flex items-center px-8 h-16 sticky top-0 z-20">
          <nav class="flex gap-8">
            <a class="text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition" href="#">Visualizar</a>
            <a class="text-blue-600 font-semibold border-b-2 border-blue-500" href="#">Importar</a>
            <a class="text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition" href="#">Agregar Ítem</a>
            <a class="text-gray-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition" href="#">Eliminar</a>
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
export class MainLayoutComponent implements OnInit {
  mostrarHeader = true;
  constructor(public router: Router) {}

  ngOnInit(): void {
    const allowedRoutes = ['/plan-anual', '/confidencial', '/gasto-real'];
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.mostrarHeader = allowedRoutes.includes(event.urlAfterRedirects);
      }
    });
    // Inicializa el estado al cargar
    this.mostrarHeader = allowedRoutes.includes(this.router.url);
  }

  toggleHeader(): void {
    this.mostrarHeader = !this.mostrarHeader;
  }
}