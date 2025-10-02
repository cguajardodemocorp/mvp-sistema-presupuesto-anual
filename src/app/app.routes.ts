import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout.component';
import { PortalPageComponent } from './pages/portal-page.component';
import { ConfidencialPageComponent } from './pages/confidencial.component';
import { AjustesPageComponent } from './pages/ajustes.component';

import { PlanAnualVisualizarComponent } from './pages/plan-anual/plan-visualizar.component';
import { PlanAnualImportarComponent } from './pages/plan-anual/plan-importar.component';
import { PlanAnualAgregarItemComponent } from './pages/plan-anual/plan-agregar-item.component';
import { PlanAnualEliminarComponent } from './pages/plan-anual/plan-eliminar.component';

import { GastoRealVisualizarComponent } from './pages/gasto-real/gasto-visualizar.component';
import { GastoRealImportarComponent } from './pages/gasto-real/gasto-importar.component';
import { GastoRealAgregarItemComponent } from './pages/gasto-real/gasto-agregar-item.component';
import { GastoRealEliminarComponent } from './pages/gasto-real/gasto-eliminar.component';

import { ConfidencialVisualizarComponent } from './pages/confidencial/confidencial-visualizar.component';
import { ConfidencialImportarComponent } from './pages/confidencial/confidencial-importar.component';
import { ConfidencialAgregarItemComponent } from './pages/confidencial/confidencial-agregar-item.component';
import { ConfidencialEliminarComponent } from './pages/confidencial/confidencial-eliminar.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'portal', pathMatch: 'full' },
      { path: 'portal', component: PortalPageComponent },
  { path: 'plan-anual', redirectTo: 'plan-anual/importar', pathMatch: 'full' },
  { path: 'plan-anual/visualizar', component: PlanAnualVisualizarComponent },
  { path: 'plan-anual/importar', component: PlanAnualImportarComponent },
  { path: 'plan-anual/agregar-item', component: PlanAnualAgregarItemComponent },
  { path: 'plan-anual/eliminar', component: PlanAnualEliminarComponent },

  { path: 'gasto-real', redirectTo: 'gasto-real/importar', pathMatch: 'full' },
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