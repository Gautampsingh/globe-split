import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyFormat', standalone: true })
export class CurrencyFormatPipe implements PipeTransform {
	transform(value: number | null | undefined, currency: string = 'USD'): string {
		if (value == null) return '';
		try {
			return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
		} catch {
			return String(value);
		}
	}
}
