import { Routes } from '@angular/router';
import { autenticadorGuard } from './shared/services/auth/autenticador-guard';
import { ModuleWithComponentFactories } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cadastro',
    pathMatch: 'full'
  },
    {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/cadastro/cadastro').then(modulo => modulo.Cadastro),
  },
  {
    path: 'home',
    loadComponent: () => import('./features/cliente/pages/cliente-home/ClienteHome').then(modulo => modulo.ClienteHome),
    canActivate: [autenticadorGuard], 
    data: {
      role: 'CLIENTE'
    }
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./features/auth/pages/cadastro/cadastro').then(modulo => modulo.Cadastro),
  },
  {
    path: 'orcamento/:id',
   loadComponent: () => import('./features/cliente/pages/orcamento/orcamento').then(modulo => modulo.Orcamento),
    canActivate: [autenticadorGuard], 
    data: {
      role: 'CLIENTE'
    }
  },
  {
    path: 'pagar-servico/:id',
    loadComponent: () => import('./features/cliente/pages/pagar-manuntencao/PagarManuntencao').then(modulo => modulo.PagarManuntencao),
    canActivate: [autenticadorGuard], 
    data: {
      role: 'CLIENTE'
    }
  },

  {path: 'employee',loadComponent: () => import('./features/funcionario/components/layout/layout').then(modulo => modulo.Layout), children: [
      {
        path: 'home',
        loadComponent: () => import ('./features/funcionario/pages/funcionario-home/FuncionarioHome').then(modulo => modulo.FuncionarioHome),
        canActivate: [autenticadorGuard], 
        data: {
          role: 'FUNCIONARIO'
        }
      },
      { 
        path: 'orcamento/:id', 
       loadComponent: () => import('./features/funcionario/pages/efetuar-orcamento/EfetuarOrcamento').then(modulo => modulo.EfetuarOrcamento),
        canActivate: [autenticadorGuard], 
        data: {
          role: 'FUNCIONARIO'
        }
      },
      { 
        path: 'manutencao/:id', 
        loadComponent: () => import('./features/funcionario/pages/efetuar-manutencao/EfetuarManutencao').then(modulo => modulo.EfetuarManutencao),
        canActivate: [autenticadorGuard], 
        data: {
          role: 'FUNCIONARIO'
        }
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/funcionario/pages/categorias/categorias').then(modulo => modulo.Categorias),
        canActivate: [autenticadorGuard], 
        data: {
          role: 'FUNCIONARIO'
        }
      },
      {
        path: 'crud-funcionario',
        loadComponent: () => import('./features/funcionario/pages/funcionarios/funcionarios').then(modulo => modulo.Funcionarios),
        canActivate: [autenticadorGuard], 
        data: {
          role: 'FUNCIONARIO'
        }
      }
      ,
      {
        path: 'add-funcionario',
        loadComponent: () => import('./features/funcionario/pages/addfuncionario/addfuncionario').then(modulo => modulo.Addfuncionario),
        canActivate: [autenticadorGuard], 
        data: {
          role: 'FUNCIONARIO'
        }
      },
      {
        path: 'edit-funcionario/:id',
        loadComponent: () => import('./features/funcionario/pages/addfuncionario/addfuncionario').then(modulo => modulo.Addfuncionario),
        canActivate: [autenticadorGuard], 
        data: {
          role: 'FUNCIONARIO'
        }
      },
      {
        path: 'relatorios/receitas',
        loadComponent: () => import('./features/funcionario/pages/relatorio-receitas/relatorio-receitas').then(modulo => modulo.RelatorioReceitas),
        canActivate: [autenticadorGuard],
        data: { role: 'FUNCIONARIO' }
      },
      {
        path: 'relatorios/categorias',
        loadComponent: () => import('./features/funcionario/pages/relatorio-categorias/relatorio-categorias').then(modulo => modulo.RelatorioCategorias),
        canActivate: [autenticadorGuard],
        data: { role: 'FUNCIONARIO' }
      },
    ]
  },
  {
    path: 'solicitar-manutencao',
    loadComponent: () => import('./features/cliente/pages/solicitar-manutencao/SolicitarManutencao').then(modulo => modulo.SolicitarManutencao),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
