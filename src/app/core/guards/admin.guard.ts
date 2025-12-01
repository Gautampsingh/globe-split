import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleStateService {
	isAdmin(): boolean {
		try {
			const raw = localStorage.getItem('futura_user');
			const user = raw ? JSON.parse(raw) : null;
			return !!user && user.role === 'admin';
		} catch {
			return false;
		}
	}
}

export const adminGuard: CanActivateFn = () => {
	const router = inject(Router);
	const roles = inject(RoleStateService);
	if (roles.isAdmin()) {
		return true;
	}
	router.navigate(['/dashboard']);
	return false;
};
