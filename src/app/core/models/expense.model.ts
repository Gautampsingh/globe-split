export interface Expense {
	id: string;
	tripId: string;
	title: string;
	amount: number;
	currency?: string;
	date?: string;
	createdBy?: string;
}
