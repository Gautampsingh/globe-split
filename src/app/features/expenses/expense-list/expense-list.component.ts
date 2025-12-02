import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesService } from '../../../core/services/expenses.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { ExpenseCardComponent } from '../expense-card/expense-card.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-expense-list',
	standalone: true,
	imports: [CommonModule, FormsModule, CurrencyFormatPipe, ExpenseCardComponent, RouterLink],
	templateUrl: './expense-list.component.html',
	styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent {
	constructor(private expensesService: ExpensesService) {
		// Track initial loading to show skeletons briefly and cache list
		this.expensesService.getExpenses$().subscribe(list => {
			this.updateCache(list || []);
			if (this.initialLoading) {
				setTimeout(() => this.initialLoading = false, 150);
			}
		});
	}
	get expenses$() { return this.expensesService.getExpenses$(); }

	conversionEnabled = false;
	targetCurrency = 'USD';
	currencyCodes = [
		'USD','EUR','GBP','INR','JPY','AUD','CAD','CHF','CNY','NZD','SEK','MXN','BRL','ZAR','RUB',
		'SGD','HKD','KRW','NOK','DKK','PLN','TRY','AED','SAR','THB','TWD','MYR','IDR','CLP','COP','ARS','EGP'
	];

	// Rates relative to 1 USD (approx sample values)
	private rates: Record<string, number> = {
		USD: 1,
		EUR: 0.92,
		GBP: 0.78,
		INR: 83.1,
		JPY: 155,
		AUD: 1.52,
		CAD: 1.36,
		CHF: 0.89,
		CNY: 7.1,
		NZD: 1.64,
		SEK: 10.5,
		MXN: 17.2,
		BRL: 5.6,
		ZAR: 18.3,
		RUB: 92,
		SGD: 1.35,
		HKD: 7.8,
		KRW: 1350,
		NOK: 10.6,
		DKK: 6.85,
		PLN: 4.0,
		TRY: 34,
		AED: 3.67,
		SAR: 3.75,
		THB: 36.5,
		TWD: 31.9,
		MYR: 4.7,
		IDR: 15900,
		CLP: 930,
		COP: 4100,
		ARS: 880,
		EGP: 49
	};

	toggleConversion() { this.conversionEnabled = !this.conversionEnabled; }

	convertAmount(amount: number, from: string | undefined, to: string): number {
		if (!this.conversionEnabled || !from || from === to) return amount;
		const rateFrom = this.rates[from];
		const rateTo = this.rates[to];
		if (!rateFrom || !rateTo) return amount;
		// Convert: amount_in_usd = amount / rateFrom (if rateFrom is units per USD?)
		// We stored rates as units per USD; so USD -> currency = rate. currency -> USD = amount / rate.
		const amountInUSD = amount / rateFrom;
		return +(amountInUSD * rateTo).toFixed(2);
	}

	getDisplayAmount(e: { amount: number; currency?: string }): number {
		return this.convertAmount(e.amount, e.currency || 'USD', this.targetCurrency);
	}

	// Editing state
	editingId: string | null = null;
	editModel: { title: string; amount: number; currency: string; description?: string; date?: string } | null = null;
	initialLoading = true;
	toastMessage = '';
	private toastTimer: any;
	loadingAction: string | null = null;
	confirmDeleteId: string | null = null;
	confirmDeleteTitle = '';

	// Pagination
	pageSize = 10;
	currentPage = 0;
	private cachedExpenses: any[] = [];

	private updateCache(list: any[]) {
		this.cachedExpenses = list;
		this.ensurePageInRange();
	}

	get totalExpenses(): number { return this.cachedExpenses.length; }
	get displayedExpenses(): any[] {
		const start = this.currentPage * this.pageSize;
		return this.cachedExpenses.slice(start, start + this.pageSize);
	}
	get totalPages(): number { return Math.max(1, Math.ceil(this.totalExpenses / this.pageSize)); }

	ensurePageInRange() {
		if (this.currentPage >= this.totalPages) this.currentPage = this.totalPages - 1;
		if (this.currentPage < 0) this.currentPage = 0;
	}
	nextPage() { if (this.currentPage < this.totalPages - 1) this.currentPage++; }
	prevPage() { if (this.currentPage > 0) this.currentPage--; }
	changePageSize(size: number) { this.pageSize = size; this.currentPage = 0; this.ensurePageInRange(); }

	startEdit(exp: any) {
		this.loadingAction = null;
		this.editingId = exp.id;
		this.editModel = {
			title: exp.title,
			amount: exp.amount,
			currency: exp.currency || 'USD',
			description: exp.description,
			date: exp.date
		};
	}

	cancelEdit() {
		this.editingId = null;
		this.editModel = null;
	}

	saveEdit() {
		if (!this.editingId || !this.editModel) return;
		const { title, amount, currency, description, date } = this.editModel;
		if (!title.trim()) return;
		this.loadingAction = 'Saving expense...';
		setTimeout(() => {
			this.expensesService.updateExpense({ id: this.editingId!, title, amount, currency, description, date });
			this.cancelEdit();
			this.loadingAction = null;
			this.showToast('Expense updated');
		}, 300);
	}

	requestDelete(id: string, title: string) {
		this.confirmDeleteId = id;
		this.confirmDeleteTitle = title;
	}

	confirmDelete() {
		if (!this.confirmDeleteId) return;
		const id = this.confirmDeleteId;
		this.loadingAction = 'Deleting expense...';
		setTimeout(() => {
			this.expensesService.deleteExpense(id);
			if (this.editingId === id) this.cancelEdit();
			this.loadingAction = null;
			this.showToast('Expense deleted');
			this.confirmDeleteId = null;
			this.confirmDeleteTitle = '';
		}, 250);
	}

	cancelDelete() {
		this.confirmDeleteId = null;
		this.confirmDeleteTitle = '';
	}

	showToast(msg: string) {
		this.toastMessage = msg;
		clearTimeout(this.toastTimer);
		this.toastTimer = setTimeout(() => this.toastMessage = '', 2500);
	}
}
