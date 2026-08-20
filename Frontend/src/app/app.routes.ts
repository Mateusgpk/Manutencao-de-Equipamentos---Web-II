import { Routes } from '@angular/router';
import { ClientHomepage } from './features/client/homepage/client-homepage';
import { EmployeeHomepage } from './features/employee/homepage/employee-homepage';
import { Orcamento } from './features/client/orcamento/orcamento';

export const routes: Routes = [
  {
    path: '',
    component: ClientHomepage,
  },
  {
    path: 'orcamento/:id',
    component: Orcamento,
  },
  {
    path: 'employee/home',
    component: EmployeeHomepage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
