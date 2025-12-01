export interface User {
	id: string;
	email: string;
	role: 'admin' | 'user';
	name?: string;
}
