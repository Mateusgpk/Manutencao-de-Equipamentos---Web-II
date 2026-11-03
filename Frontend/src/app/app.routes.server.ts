import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'orcamento/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'pagar-servico/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'employee/orcamento/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'employee/manutencao/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'employee/edit-funcionario/:id',
    renderMode: RenderMode.Server,
  },
  {
  path: '**',
  renderMode: RenderMode.Prerender
  },
];
