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
	constructor(private expensesService: ExpensesService) {}
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
}
