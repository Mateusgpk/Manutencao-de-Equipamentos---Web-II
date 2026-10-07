import { CanActivateFn, Router } from '@angular/router';
import { Autenticador } from './autenticador';
import { inject } from '@angular/core';

export const autenticadorGuard: CanActivateFn = (route, state) => {
  const loginuser = inject(Autenticador);
  const router = inject(Router);
  const usuarioLogado = loginuser.usuarioLogado;
  const url = state.url;

  if (!usuarioLogado) {
    router.navigate(['/login'], {
      queryParams: {
        error: 'Deve fazer o login antes de acessar ' + url
      }
    });

    return false;
  }

  if (
    route.data?.['role'] &&
    route.data['role'] !== usuarioLogado.user.role
  ) {
    router.navigate(['/login'], {
      queryParams: {
        error: 'Proibido o acesso a ' + url
      }
    });

    return false;
  }

  return true;
};