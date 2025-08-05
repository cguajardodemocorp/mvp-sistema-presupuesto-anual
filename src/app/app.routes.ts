import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout.component';
import { PortalPageComponent } from './pages/portal-page.component';
import { PlanAnualPageComponent } from './pages/plan-anual.component';
import { GastoRealPageComponent } from './pages/gasto-real.component';
import { ConfidencialPageComponent } from './pages/confidencial.component';
import { AjustesPageComponent } from './pages/ajustes.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'portal', pathMatch: 'full' },
      { path: 'portal', component: PortalPageComponent },
      { path: 'plan-anual', component: PlanAnualPageComponent },
      { path: 'gasto-real', component: GastoRealPageComponent },
      { path: 'confidencial', component: ConfidencialPageComponent },
      { path: 'ajustes', component: AjustesPageComponent },
      { path: '**', redirectTo: 'portal' }
    ]
  }
];