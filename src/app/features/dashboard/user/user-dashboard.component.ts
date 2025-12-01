import { Component } from '@angular/core';
import { FuturisticCardComponent } from '../../../shared/ui/futuristic-card.component';

@Component({
	selector: 'app-user-dashboard',
	standalone: true,
	imports: [FuturisticCardComponent],
	templateUrl: './user-dashboard.component.html',
	styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent {}
