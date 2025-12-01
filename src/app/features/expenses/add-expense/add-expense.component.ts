import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpensesService } from '../../../core/services/expenses.service';

@Component({
	selector: 'app-add-expense',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './add-expense.component.html',
	styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent {
	id = '';
	title = '';
	amount: number | null = null;
	description = '';
	date: string = new Date().toISOString().slice(0, 10);
	currency = 'USD';
	currencies: Array<{ code: string; flag: string }> = [
		{ code: 'USD', flag: '🇺🇸' },
		{ code: 'EUR', flag: '🇪🇺' },
		{ code: 'GBP', flag: '🇬🇧' },
		{ code: 'INR', flag: '🇮🇳' },
		{ code: 'JPY', flag: '🇯🇵' },
		{ code: 'AUD', flag: '🇦🇺' },
		{ code: 'CAD', flag: '🇨🇦' },
		{ code: 'CHF', flag: '🇨🇭' },
		{ code: 'CNY', flag: '🇨🇳' },
		{ code: 'NZD', flag: '🇳🇿' },
		{ code: 'SEK', flag: '🇸🇪' },
		{ code: 'MXN', flag: '🇲🇽' },
		{ code: 'BRL', flag: '🇧🇷' },
		{ code: 'ZAR', flag: '🇿🇦' },
		{ code: 'RUB', flag: '🇷🇺' },
		{ code: 'SGD', flag: '🇸🇬' },
		{ code: 'HKD', flag: '🇭🇰' },
		{ code: 'KRW', flag: '🇰🇷' },
		{ code: 'NOK', flag: '🇳🇴' },
		{ code: 'DKK', flag: '🇩🇰' },
		{ code: 'PLN', flag: '🇵🇱' },
		{ code: 'TRY', flag: '🇹🇷' },
		{ code: 'AED', flag: '🇦🇪' },
		{ code: 'SAR', flag: '🇸🇦' },
		{ code: 'THB', flag: '🇹🇭' },
		{ code: 'TWD', flag: '🇹🇼' },
		{ code: 'MYR', flag: '🇲🇾' },
		{ code: 'IDR', flag: '🇮🇩' },
		{ code: 'CLP', flag: '🇨🇱' },
		{ code: 'COP', flag: '🇨🇴' },
		{ code: 'ARS', flag: '🇦🇷' },
		{ code: 'EGP', flag: '🇪🇬' }
	];

	get filteredCurrencies(): Array<{ code: string; flag: string }> {
		const q = (this.currency || '').toLowerCase();
		if (!q) return this.currencies;
		return this.currencies.filter(c => c.code.toLowerCase().includes(q));
	}

	get selectedFlag(): string {
		const found = this.currencies.find(c => c.code === this.currency);
		return found ? found.flag : '';
	}

	private currencyToCountry: Record<string, string> = {
		USD: 'us', EUR: 'eu', GBP: 'gb', INR: 'in', JPY: 'jp',
		AUD: 'au', CAD: 'ca', CHF: 'ch', CNY: 'cn', NZD: 'nz',
		SEK: 'se', MXN: 'mx', BRL: 'br', ZAR: 'za', RUB: 'ru',
		SGD: 'sg', HKD: 'hk', KRW: 'kr', NOK: 'no', DKK: 'dk',
		PLN: 'pl', TRY: 'tr', AED: 'ae', SAR: 'sa', THB: 'th',
		TWD: 'tw', MYR: 'my', IDR: 'id', CLP: 'cl', COP: 'co',
		ARS: 'ar', EGP: 'eg'
	};

	flagUrl(code: string | null | undefined): string {
		if (!code) return '';
		const cc = this.currencyToCountry[code] || '';
		return cc ? `/assets/flags/${cc}.svg` : '';
	}

	saving = false;

	constructor(private expenses: ExpensesService, private router: Router) {}

	submit() {
		if (!this.title || this.amount == null || this.amount < 0) {
			alert('Provide title and valid amount');
			return;
		}
		this.saving = true;
		this.expenses.addExpense({ title: this.title, amount: this.amount, currency: this.currency, description: this.description, date: this.date });
		this.router.navigate(['/expenses']);
	}

	cancel() {
		this.router.navigate(['/expenses']);
	}
}
