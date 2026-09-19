import { Routes } from '@angular/router';
import { ClientHomepage } from './features/client/pages/homepage/client-homepage';
import { FormsCadastroComponent } from './features/autenticacao/pages/forms-cadastro';
import { SolicitarManutencao } from './features/client/pages/solicitar-manutencao/solicitar-manutencao';
import { Orcamento } from './features/client/pages/orcamento/orcamento';
import { EmployeeHomepage } from './features/employee/pages/homepage/employee-homepage';
import { EfetuarOrcamento } from './features/employee/pages/efetuar-orcamento/efetuar-orcamento';
import { CategoriesComponent } from './features/employee/pages/categories/categories';
import { LayoutEmployee } from './features/employee/layout-employee/layout-employee';
import { CrudFuncionario } from './features/employee/pages/crud-funcionario/crud-funcionario';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cadastro',
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

  {path: 'employee', component: LayoutEmployee, children: [
      {
        path: 'home',
        component: EmployeeHomepage,
      },
      { 
        path: 'orcamento/:id', 
        component: EfetuarOrcamento 
      },
      {
        path: 'categories',
        component: CategoriesComponent,
      },
      {
        path: 'crud-funcionario',
        component: CrudFuncionario,
      }
    ]
  },
  {
    path: 'solicitar-manutencao',
    component: SolicitarManutencao,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
