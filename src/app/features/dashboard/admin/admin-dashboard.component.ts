import { Component } from '@angular/core';
import { FuturisticCardComponent } from '../../../shared/ui/futuristic-card.component';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-admin-dashboard',
	standalone: true,
	imports: [FuturisticCardComponent, RouterLink],
	templateUrl: './admin-dashboard.component.html',
	styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {}
