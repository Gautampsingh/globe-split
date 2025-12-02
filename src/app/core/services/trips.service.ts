import { Injectable } from '@angular/core';

export interface TripSummary {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	location: string;
	assignedTo: string[]; // user emails with access
}

@Injectable({ providedIn: 'root' })
export class TripsService {
	private storageKey = 'futura_trips';
	private CURRENT_VERSION = 1;
	private trips: TripSummary[] = [
		{
			id: 't1',
			name: 'Iceland Adventure',
			startDate: '2024-06-15',
			endDate: '2024-06-22',
			location: 'Iceland',
			assignedTo: ['admin@futura.com', 'user1@futura.com']
		},
		{
			id: 't2',
			name: 'Tokyo Food Tour',
			startDate: '2024-07-20',
			endDate: '2024-07-27',
			location: 'Tokyo, Japan',
			assignedTo: ['admin@futura.com', 'user2@futura.com']
		},
		{
			id: 't3',
			name: 'Alps Hiking',
			startDate: '2024-08-10',
			endDate: '2024-08-18',
			location: 'Swiss Alps',
			assignedTo: ['admin@futura.com']
		}
	];

	constructor() {
		this.load();
	}

	private load() {
		try {
			const raw = localStorage.getItem(this.storageKey);
			if (!raw) return;
			const parsed = JSON.parse(raw);
			// Legacy (array only)
			if (Array.isArray(parsed)) {
				this.trips = parsed;
				this.persist(); // migrate to versioned structure
				return;
			}
			// Versioned object
			if (parsed && typeof parsed === 'object') {
				const version = parsed.version ?? 0;
				if (Array.isArray(parsed.trips)) {
					this.trips = parsed.trips as TripSummary[];
				}
				// Future migrations: if version < CURRENT_VERSION apply transforms here.
				if (version !== this.CURRENT_VERSION) {
					this.persist(); // rewrite with current version
				}
			}
		} catch {
			/* ignore parse errors */
		}
	}

	private persist() {
		try {
			const payload = { version: this.CURRENT_VERSION, trips: this.trips };
			localStorage.setItem(this.storageKey, JSON.stringify(payload));
		} catch {
			/* ignore storage errors */
		}
	}

	listTrips(): Promise<TripSummary[]> {
		return Promise.resolve(this.trips);
	}

	listTripsForUser(email: string, isAdmin: boolean): Promise<TripSummary[]> {
		if (isAdmin) return this.listTrips();
		return Promise.resolve(this.trips.filter(t => t.assignedTo.includes(email)));
	}

	addTrip(trip: Omit<TripSummary, 'id'> & { id?: string }): Promise<TripSummary> {
		const newTrip: TripSummary = { ...trip, id: trip.id || 't' + (this.trips.length + 1) };
		this.trips.push(newTrip);
		this.persist();
		return Promise.resolve(newTrip);
	}

	updateTrip(updated: TripSummary): Promise<TripSummary> {
		const idx = this.trips.findIndex(t => t.id === updated.id);
		if (idx !== -1) {
			this.trips[idx] = { ...updated };
			this.persist();
		}
		return Promise.resolve(updated);
	}

	deleteTrip(id: string): Promise<boolean> {
		const before = this.trips.length;
		this.trips = this.trips.filter(t => t.id !== id);
		if (this.trips.length !== before) this.persist();
		return Promise.resolve(this.trips.length !== before);
	}

	getTrip(id: string): Promise<TripSummary | undefined> {
		return Promise.resolve(this.trips.find(t => t.id === id));
	}
}
