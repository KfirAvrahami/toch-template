import { Routes } from '@angular/router';
import { Page2ApiProviders } from './features/page2/adapters/providers';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home').then((m) => m.HomeComponent)
  },
  {
    path: 'page-2',
    providers: [...Page2ApiProviders.Api],
    loadComponent: () => import('./features/page2').then((m) => m.PageTwoComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found').then((m) => m.NotFoundComponent)
  }
];
