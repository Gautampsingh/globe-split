import { Component } from '@angular/core';
import { FuturisticCardComponent } from '../../../shared/ui/futuristic-card.component';

@Component({
	selector: 'app-admin-dashboard',
	standalone: true,
	imports: [FuturisticCardComponent],
	templateUrl: './admin-dashboard.component.html',
	styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {}
