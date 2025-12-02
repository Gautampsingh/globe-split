import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TripsService, TripSummary } from '../../../core/services/trips.service';

@Component({
	selector: 'app-trip-details',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './trip-details.component.html',
	styleUrls: ['./trip-details.component.scss']
})
export class TripDetailsComponent {
	trip?: TripSummary;
	notFound = false;

	constructor(private route: ActivatedRoute, private router: Router, private trips: TripsService) {
		const id = this.route.snapshot.paramMap.get('id');
		if (!id) {
			this.notFound = true;
			return;
		}
		this.trips.getTrip(id).then(t => {
			if (!t) {
				this.notFound = true;
			} else {
				this.trip = t;
			}
		});
	}

	back() {
		this.router.navigate(['/trips']);
	}
}
