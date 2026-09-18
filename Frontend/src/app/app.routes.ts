import { Routes } from '@angular/router';
import { ClientHomepage } from './features/client/pages/homepage/client-homepage';
import { FormsCadastroComponent } from './features/autenticacao/pages/forms-cadastro';
import { SolicitarManutencao } from './features/client/pages/solicitar-manutencao/solicitar-manutencao';
import { Orcamento } from './features/client/pages/orcamento/orcamento';
import { EmployeeHomepage } from './features/employee/pages/homepage/employee-homepage';
import { EfetuarOrcamento } from './features/employee/pages/efetuar-orcamento/efetuar-orcamento';
import { CategoriesComponent } from './features/employee/pages/categories/categories';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
    {
    path: 'login',
    component: FormsCadastroComponent,
  },
  {
    path: 'home',
    component: ClientHomepage,
  },
  {
    path: 'cadastro',
    component: FormsCadastroComponent,
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
    path: 'employee/orcamento/:id', 
    component: EfetuarOrcamento 
  },
  {
    path: 'solicitar-manutencao',
    component: SolicitarManutencao,
  },
  {
    path: 'employee/categories',
    component: CategoriesComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
