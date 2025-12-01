import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-futuristic-card',
	standalone: true,
	template: `<div class="card"><h3>{{title}}</h3><ng-content></ng-content></div>`,
	styles: [`.card{padding:1rem;border:1px solid #333;border-radius:8px}`]
})
export class FuturisticCardComponent {
	@Input() title = '';
}
