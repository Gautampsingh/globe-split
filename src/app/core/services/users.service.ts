import { Injectable } from '@angular/core';

export interface UserProfile {
	id: string;
	name: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
	getProfile(): Promise<UserProfile | null> {
		return Promise.resolve(null);
	}
	listAdmins(): Promise<UserProfile[]> {
		return Promise.resolve([]);
	}
}
