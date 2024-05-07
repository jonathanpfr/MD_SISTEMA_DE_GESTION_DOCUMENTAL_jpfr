import { Routes } from '@angular/router';
import { InitialDataResolver } from './app.resolvers';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [AuthenticatedGuard],
    // data: { layout: 'modern' }, // Layout por defecto
    resolve: {
      initialData: InitialDataResolver,
    },
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.routes)
  },
  {
    path: 'error/:code',
    loadComponent: () => import('./features/error/error.component').then(m => m.ErrorComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/error/error.component').then(m => m.ErrorComponent)
  }
];
