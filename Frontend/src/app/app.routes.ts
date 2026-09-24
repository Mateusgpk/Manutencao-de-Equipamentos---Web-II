import { Routes } from '@angular/router';
import { ClienteHome } from './features/cliente/pages/cliente-home/ClienteHome';
import { Cadastro } from './features/auth/pages/cadastro/cadastro';
import { SolicitarManutencao } from './features/cliente/pages/solicitar-manutencao/SolicitarManutencao';
import { Orcamento } from './features/cliente/pages/orcamento/orcamento';
import { PagarManuntencao } from './features/cliente/pages/pagar-manuntencao/PagarManuntencao';
import { FuncionarioHome } from './features/funcionario/pages/funcionario-home/FuncionarioHome';
import { EfetuarOrcamento } from './features/funcionario/pages/efetuar-orcamento/EfetuarOrcamento';
import { Categorias } from './features/funcionario/pages/categorias/categorias';
import { Layout } from './features/funcionario/components/layout/layout';
import { Funcionarios } from './features/funcionario/pages/funcionarios/funcionarios';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cadastro',
    pathMatch: 'full'
  },
    {
    path: 'login',
    component: Cadastro,
  },
  {
    path: 'home',
    component: ClienteHome,
  },
  {
    path: 'cadastro',
    component: Cadastro,
  },
  {
    path: 'orcamento/:id',
    component: Orcamento,
  },
  {
    path: 'pagar-servico/:id',
    component: PagarManuntencao,
  },

  {path: 'employee', component: Layout, children: [
      {
        path: 'home',
        component: ClienteHome,
      },
      { 
        path: 'orcamento/:id', 
        component: EfetuarOrcamento 
      },
      {
        path: 'categories',
        component: Categorias,
      },
      {
        path: 'crud-funcionario',
        component: Funcionarios,
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
