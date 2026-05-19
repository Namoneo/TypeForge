import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStore } from '../store/app.store';

export const adminGuard: CanActivateFn = () => {
  const store = inject(AppStore);
  const router = inject(Router);

  if (store.isAdmin()) return true;

  router.navigate(['/dashboard']);
  return false;
};
