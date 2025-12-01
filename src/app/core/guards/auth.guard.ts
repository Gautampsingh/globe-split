import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
	isLoggedIn(): boolean {
		return !!localStorage.getItem('futura_user');
	}
}

export const authGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const auth = inject(AuthStateService);
	if (auth.isLoggedIn()) {
		return true;
	}
	router.navigate(['/login'], { queryParams: { redirect: state.url } });
	return false;
};
