import { Routes } from '@angular/router';
import { ClientHomepage } from './features/client/homepage/client-homepage';
import { SolicitarManutencao } from './features/client/solicitar-manutencao/solicitar-manutencao';
import { Orcamento } from './features/client/orcamento/orcamento';
import { EmployeeHomepage } from './features/employee/homepage/employee-homepage';
import { EfetuarOrcamento } from './features/employee/efetuar-orcamento/efetuar-orcamento';
import { CadastroComponent } from './features/Autocadastro/pages/cadastro';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
    {
    path: 'login',
    component: CadastroComponent,
  },
  {
    path: 'home',
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
    path: 'employee/orcamento/:id', 
    component: EfetuarOrcamento 
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
