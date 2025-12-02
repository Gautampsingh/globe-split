import { Component } from '@angular/core';
import { FuturisticCardComponent } from '../../../shared/ui/futuristic-card.component';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-user-dashboard',
	standalone: true,
	imports: [FuturisticCardComponent, RouterLink],
	templateUrl: './user-dashboard.component.html',
	styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent {}
