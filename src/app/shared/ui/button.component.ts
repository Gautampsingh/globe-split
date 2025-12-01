import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-button',
	standalone: true,
	template: `<button [disabled]="disabled" class="btn"><ng-content></ng-content></button>`,
	styles: [`.btn{padding:.5rem 1rem;border:none;border-radius:4px;}`]
})
export class ButtonComponent {
	@Input() disabled = false;
}
