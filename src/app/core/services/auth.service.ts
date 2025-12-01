import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
	login(username: string, password: string) {
		// TODO: implement
		return Promise.resolve({ success: true });
	}
	logout() {
		// TODO: implement
	}
}
