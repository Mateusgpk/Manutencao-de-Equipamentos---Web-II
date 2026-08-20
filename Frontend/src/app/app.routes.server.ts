import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'orcamento/:id',
    renderMode: RenderMode.Server,
  },
  { 
    path: 'employee/orcamento/:id', 
    renderMode: RenderMode.Server 
  }, 
];
