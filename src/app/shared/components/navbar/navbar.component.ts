import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule, RouterLink, RouterLinkActive],
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
	constructor(private router: Router) {}

	get isLoggedIn(): boolean {
		return !!localStorage.getItem('futura_user');
	}

	get isAdmin(): boolean {
		try {
			const raw = localStorage.getItem('futura_user');
			const user = raw ? JSON.parse(raw) : null;
			return !!user && user.role === 'admin';
		} catch {
			return false;
		}
	}

	logout(): void {
		localStorage.removeItem('futura_user');
		this.router.navigate(['/login']);
	}
}
