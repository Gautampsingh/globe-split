import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
	selector: 'app-expense-card',
	standalone: true,
	imports: [CommonModule, CurrencyFormatPipe, DatePipe],
	templateUrl: './expense-card.component.html',
	styleUrls: ['./expense-card.component.scss']
})
export class ExpenseCardComponent {
	@Input() title = '';
	@Input() amount: number | null = null;
	@Input() currency = 'USD';
	@Input() description?: string;
	@Input() date?: string;
	@Input() id?: string;
	@Output() edit = new EventEmitter<string>();
	@Output() delete = new EventEmitter<string>();

	private currencyToFlag: Record<string, string> = {
		USD: 'us', EUR: 'eu', GBP: 'gb', INR: 'in', JPY: 'jp',
		AUD: 'au', CAD: 'ca', CHF: 'ch', CNY: 'cn', NZD: 'nz',
		SEK: 'se', MXN: 'mx', BRL: 'br', ZAR: 'za', RUB: 'ru',
		SGD: 'sg', HKD: 'hk', KRW: 'kr', NOK: 'no', DKK: 'dk',
		PLN: 'pl', TRY: 'tr', AED: 'ae', SAR: 'sa', THB: 'th',
		TWD: 'tw', MYR: 'my', IDR: 'id', CLP: 'cl', COP: 'co',
		ARS: 'ar', EGP: 'eg'
	};

	flagUrl(currency: string | null | undefined): string {
		if (!currency) return '';
		const cc = this.currencyToFlag[currency] || '';
		return cc ? `/assets/flags/${cc}.svg` : '';
	}

	onEdit() { if (this.id) this.edit.emit(this.id); }
	onDelete() { if (this.id) this.delete.emit(this.id); }
}
