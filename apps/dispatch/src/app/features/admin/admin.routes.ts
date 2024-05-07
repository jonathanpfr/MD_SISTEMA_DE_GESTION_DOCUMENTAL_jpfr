import { Route } from "@angular/router";

export const routes: Route[] = [
  {
    path: '',
    redirectTo: 'proveedor',
    pathMatch: 'full'
  },
  {
    path: 'proveedor',
    loadChildren: () => import('./views/supplier/supplier.routes').then(m => m.routes)
  }
]