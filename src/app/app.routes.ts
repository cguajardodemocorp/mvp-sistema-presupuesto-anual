import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout.component';
import { PortalPageComponent } from './pages/portal-page.component';
import { PlanAnualPageComponent } from './pages/plan-anual.component';
import { GastoRealPageComponent } from './pages/gasto-real.component';
import { ConfidencialPageComponent } from './pages/confidencial.component';
import { AjustesPageComponent } from './pages/ajustes.component';

import { PlanAnualVisualizarComponent } from './pages/plan-anual/visualizar.component';
import { PlanAnualImportarComponent } from './pages/plan-anual/importar.component';
import { PlanAnualAgregarItemComponent } from './pages/plan-anual/agregar-item.component';
import { PlanAnualEliminarComponent } from './pages/plan-anual/eliminar.component';

import { GastoRealVisualizarComponent } from './pages/gasto-real/visualizar.component';
import { GastoRealImportarComponent } from './pages/gasto-real/importar.component';
import { GastoRealAgregarItemComponent } from './pages/gasto-real/agregar-item.component';
import { GastoRealEliminarComponent } from './pages/gasto-real/eliminar.component';

import { ConfidencialVisualizarComponent } from './pages/confidencial/visualizar.component';
import { ConfidencialImportarComponent } from './pages/confidencial/importar.component';
import { ConfidencialAgregarItemComponent } from './pages/confidencial/agregar-item.component';
import { ConfidencialEliminarComponent } from './pages/confidencial/eliminar.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'portal', pathMatch: 'full' },
      { path: 'portal', component: PortalPageComponent },
  { path: 'plan-anual', component: PlanAnualPageComponent },
  { path: 'plan-anual/visualizar', component: PlanAnualVisualizarComponent },
  { path: 'plan-anual/importar', component: PlanAnualImportarComponent },
  { path: 'plan-anual/agregar-item', component: PlanAnualAgregarItemComponent },
  { path: 'plan-anual/eliminar', component: PlanAnualEliminarComponent },

  { path: 'gasto-real', component: GastoRealPageComponent },
  { path: 'gasto-real/visualizar', component: GastoRealVisualizarComponent },
  { path: 'gasto-real/importar', component: GastoRealImportarComponent },
  { path: 'gasto-real/agregar-item', component: GastoRealAgregarItemComponent },
  { path: 'gasto-real/eliminar', component: GastoRealEliminarComponent },

  { path: 'confidencial', component: ConfidencialPageComponent },
  { path: 'confidencial/visualizar', component: ConfidencialVisualizarComponent },
  { path: 'confidencial/importar', component: ConfidencialImportarComponent },
  { path: 'confidencial/agregar-item', component: ConfidencialAgregarItemComponent },
  { path: 'confidencial/eliminar', component: ConfidencialEliminarComponent },
      { path: 'ajustes', component: AjustesPageComponent },
      { path: '**', redirectTo: 'portal' }
    ]
  }
];