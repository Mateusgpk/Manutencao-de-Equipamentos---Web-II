import { Routes } from '@angular/router';
import { ClientHomepage } from './features/client/homepage/client-homepage';
import { EmployeeHomepage } from './features/employee/homepage/employee-homepage';

export const routes: Routes = [
  {
    path: '',
    component: ClientHomepage,
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
