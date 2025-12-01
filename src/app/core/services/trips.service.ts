import { Injectable } from '@angular/core';

export interface TripSummary {
	id: string;
	name: string;
}

@Injectable({ providedIn: 'root' })
export class TripsService {
	private trips: TripSummary[] = [
		{ id: 't1', name: 'Iceland Adventure' },
		{ id: 't2', name: 'Tokyo Food Tour' },
		{ id: 't3', name: 'Alps Hiking' }
	];

	listTrips(): Promise<TripSummary[]> {
		return Promise.resolve(this.trips);
	}

	getTrip(id: string): Promise<TripSummary | undefined> {
		return Promise.resolve(this.trips.find(t => t.id === id));
	}
}
