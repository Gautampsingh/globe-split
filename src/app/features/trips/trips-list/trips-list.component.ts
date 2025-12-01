import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripsService, TripSummary } from '../../../core/services/trips.service';

@Component({
	selector: 'app-trips-list',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './trips-list.component.html',
	styleUrls: ['./trips-list.component.scss']
})
export class TripsListComponent {
	trips: TripSummary[] = [];

	constructor(private tripsService: TripsService) {
		this.tripsService.listTrips().then(t => (this.trips = t));
	}
}
