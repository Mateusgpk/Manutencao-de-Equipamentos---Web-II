import { Routes } from '@angular/router';
import { ClientHomepage } from './features/client/homepage/client-homepage';

export const routes: Routes = [
  {
    path: '',
    component: ClientHomepage
  },
  {
    path: '**',
    redirectTo: ''
  }
];
