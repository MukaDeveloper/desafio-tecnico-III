import { Routes } from '@angular/router';
import { ERoutes } from './shared/utils/routes.enum';
import { Layout } from './layout/layout';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: ERoutes.LOGIN,
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ERoutes.PATIENTS,
      },
      {
        path: ERoutes.PATIENTS,
        loadComponent: () => import('./pages/patients/patients').then((m) => m.Patients),
      },
      {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
];
