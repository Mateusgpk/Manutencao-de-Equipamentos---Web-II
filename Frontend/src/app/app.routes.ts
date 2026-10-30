import { Routes } from '@angular/router';
import { ClienteHome } from './features/cliente/pages/cliente-home/ClienteHome';
import { Cadastro } from './features/auth/pages/cadastro/cadastro';
import { SolicitarManutencao } from './features/cliente/pages/solicitar-manutencao/SolicitarManutencao';
import { Orcamento } from './features/cliente/pages/orcamento/orcamento';
import { PagarManuntencao } from './features/cliente/pages/pagar-manuntencao/PagarManuntencao';
import { FuncionarioHome } from './features/funcionario/pages/funcionario-home/FuncionarioHome';
import { EfetuarOrcamento } from './features/funcionario/pages/efetuar-orcamento/EfetuarOrcamento';
import { EfetuarManutencao } from './features/funcionario/pages/efetuar-manutencao/EfetuarManutencao';
import { Categorias } from './features/funcionario/pages/categorias/categorias';
import { Layout } from './features/funcionario/components/layout/layout';
import { Funcionarios } from './features/funcionario/pages/funcionarios/funcionarios';
import { Addfuncionario } from './features/funcionario/pages/addfuncionario/addfuncionario';
import { RelatorioReceitas } from './features/funcionario/pages/relatorio-receitas/relatorio-receitas';
import { RelatorioCategorias } from './features/funcionario/pages/relatorio-categorias/relatorio-categorias';
import { autenticadorGuard } from './shared/services/auth/autenticador-guard';

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
    canActivate: [autenticadorGuard], 
    data: {
      role: 'CLIENT'
    }
  },
  {
    path: 'cadastro',
    component: Cadastro,
  },
  {
    path: 'orcamento/:id',
    component: Orcamento,
    canActivate: [autenticadorGuard], 
    data: {
      role: 'CLIENT'
    }
  },
  {
    path: 'pagar-servico/:id',
    component: PagarManuntencao,
    canActivate: [autenticadorGuard], 
    data: {
      role: 'CLIENT'
    }
  },

  {path: 'employee', component: Layout, children: [
      {
        path: 'home',
        component: FuncionarioHome,
        canActivate: [autenticadorGuard], 
        data: {
          role: 'EMPLOYEE'
        }
      },
      { 
        path: 'orcamento/:id', 
        component: EfetuarOrcamento, 
        canActivate: [autenticadorGuard], 
        data: {
          role: 'EMPLOYEE'
        }
      },
      { 
        path: 'manutencao/:id', 
        component: EfetuarManutencao, 
        canActivate: [autenticadorGuard], 
        data: {
          role: 'EMPLOYEE'
        }
      },
      {
        path: 'categories',
        component: Categorias,
        canActivate: [autenticadorGuard], 
        data: {
          role: 'EMPLOYEE'
        }
      },
      {
        path: 'crud-funcionario',
        component: Funcionarios,
        canActivate: [autenticadorGuard], 
        data: {
          role: 'EMPLOYEE'
        }
      }
      ,
      {
        path: 'add-funcionario',
        component: Addfuncionario,
        canActivate: [autenticadorGuard], 
        data: {
          role: 'EMPLOYEE'
        }
      },
      {
        path: 'edit-funcionario/:id',
        component: Addfuncionario,
        canActivate: [autenticadorGuard], 
        data: {
          role: 'EMPLOYEE'
        }
      },
      {
        path: 'relatorios/receitas',
        component: RelatorioReceitas,
        canActivate: [autenticadorGuard],
        data: { role: 'EMPLOYEE' }
      },
      {
        path: 'relatorios/categorias',
        component: RelatorioCategorias,
        canActivate: [autenticadorGuard],
        data: { role: 'EMPLOYEE' }
      },
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
