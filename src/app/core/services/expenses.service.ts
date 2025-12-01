import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ExpenseSummary {
	id: string;
	title: string;
	amount: number;
	description?: string; // Optional description field
	date?: string; // Optional date field (ISO string)
	currency?: string;
}

@Injectable({ providedIn: 'root' })
export class ExpensesService {
	private storageKey = 'futura_expenses';
	private expenses: ExpenseSummary[] = this.loadFromStorage() ?? [
		{ id: 'e1', title: 'Dinner', amount: 42.5, currency: 'USD', description: 'Team dinner', date: this.formatDate(new Date()) },
		{ id: 'e2', title: 'Taxi', amount: 18.0, currency: 'USD', description: 'Airport to hotel', date: this.formatDate(new Date()) },
		{ id: 'e3', title: 'Museum', amount: 12.0, currency: 'USD', description: 'Entry tickets', date: this.formatDate(new Date()) }
	];
	private expenses$ = new BehaviorSubject<ExpenseSummary[]>(this.expenses);

	getExpenses$(): Observable<ExpenseSummary[]> {
		return this.expenses$.asObservable();
	}

	listExpenses(tripId?: string): Promise<ExpenseSummary[]> {
		// ignoring tripId in sample data
		return Promise.resolve(this.expenses);
	}

	addExpense(data: Omit<ExpenseSummary, 'id'> & { id?: string }): void {
		const id = data.id?.trim() || 'e' + (this.expenses.length + 1);
		const normalized: ExpenseSummary = {
			id,
			...data,
			date: data.date ? this.normalizeDateInput(data.date) : undefined
		};
		this.expenses.push(normalized);
		this.persist();
		this.expenses$.next([...this.expenses]);
	}

	private normalizeDateInput(input: string): string {
		// Accepts ISO yyyy-mm-dd or any parsable date string and returns dd-MM-yyyy
		const d = new Date(input);
		if (isNaN(d.getTime())) {
			return input; // fallback to original if invalid
		}
		return this.formatDate(d);
	}

	private formatDate(d: Date): string {
		const dd = String(d.getDate()).padStart(2, '0');
		const mm = String(d.getMonth() + 1).padStart(2, '0');
		const yyyy = d.getFullYear();
		return `${dd}-${mm}-${yyyy}`;
	}

	private loadFromStorage(): ExpenseSummary[] | null {
		try {
			const raw = localStorage.getItem(this.storageKey);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	}

	private persist(): void {
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(this.expenses));
		} catch {
			// ignore storage errors
		}
	}
}
