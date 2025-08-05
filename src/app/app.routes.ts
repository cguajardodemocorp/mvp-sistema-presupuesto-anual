import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout.component';
import { PortalPageComponent } from './pages/portal-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'portal', pathMatch: 'full' },
      { path: 'portal', component: PortalPageComponent },
      { path: '**', component: PortalPageComponent } // Muestra Portal si la ruta no existe
    ]
  }
];