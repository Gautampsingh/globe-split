import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripsService, TripSummary } from '../../../core/services/trips.service';

@Component({
	selector: 'app-trips-list',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './trips-list.component.html',
	styleUrls: ['./trips-list.component.scss']
})
export class TripsListComponent {
	trips: TripSummary[] = [];
	isAdmin = false;
	userEmail = '';
	showAddDialog = false;
	newTrip = {
		name: '',
		startDate: '',
		endDate: '',
		location: '',
		assignedToText: ''
	};
	editingTripId: string | null = null;
	@ViewChild('newTripNameInput') newTripNameInput?: ElementRef<HTMLInputElement>;
	validationErrors: string[] = [];
	knownEmails: string[] = [];
	toastMessage = '';
	toastTimer: any;
	private listStateKey = 'futura_triplist_state';

	// Search & pagination
	searchTerm = '';
	pageSize = 10;
	currentPage = 0;
	knownLocations: string[] = [];
	selectedLocations: string[] = [];
	loadingAction: string | null = null;
	initialLoading = true;

	// Inline edit state
	inlineEditTrip: {
		name: string; startDate: string; endDate: string; location: string; assignedToText: string;
	} | null = null;

	constructor(private tripsService: TripsService, private router: Router) {
		this.init();
	}

	private init() {
		try {
			const raw = localStorage.getItem('futura_user');
			const user = raw ? JSON.parse(raw) : null;
			if (user) {
				this.isAdmin = user.role === 'admin';
				this.userEmail = user.email;
			}
		} catch {
			this.isAdmin = false;
		}
		this.loadListState();
		setTimeout(() => {
			this.refresh();
			this.initialLoading = false;
		}, 150);
	}

	refresh() {
		if (!this.userEmail) {
			this.trips = [];
			return;
		}
		this.tripsService.listTripsForUser(this.userEmail, this.isAdmin).then(t => {
			this.trips = t;
			this.buildKnownEmails();
				this.buildKnownLocations();
			this.ensurePageInRange();
		});
	}

	viewDetails(trip: TripSummary) {
		this.router.navigate(['/trips', trip.id]);
	}

	quickAddTrip() {
		if (!this.isAdmin) return;
		this.editingTripId = null;
		this.prepareNewTripDefaults();
		this.showAddDialog = true;
		setTimeout(() => this.newTripNameInput?.nativeElement.focus(), 0);
	}

	prepareNewTripDefaults() {
		const today = new Date();
		const start = today.toISOString().substring(0, 10);
		const end = new Date(today.getTime() + 3 * 24 * 3600 * 1000).toISOString().substring(0, 10);
		this.newTrip = {
			name: '',
			startDate: start,
			endDate: end,
			location: '',
			assignedToText: this.userEmail
		};
	}

	cancelAdd() {
		this.showAddDialog = false;
		this.editingTripId = null;
		this.validationErrors = [];
	}

	saveNewTrip() {
		this.loadingAction = this.editingTripId ? 'Updating trip...' : 'Adding trip...';
		this.validationErrors = [];
		if (!this.newTrip.name?.trim()) {
			this.validationErrors.push('Name is required');
		}
		if (!this.newTrip.location?.trim()) {
			this.validationErrors.push('Location is required');
		}
		if (this.newTrip.startDate && this.newTrip.endDate && this.newTrip.endDate < this.newTrip.startDate) {
			this.validationErrors.push('End date must not be before start date');
		}
		const assignedTo = this.newTrip.assignedToText
			.split(',')
			.map(e => e.trim())
			.filter(e => !!e);
		if (assignedTo.length === 0) {
			assignedTo.push(this.userEmail);
		}
		const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
		const invalid = assignedTo.filter(e => !emailRegex.test(e));
		if (invalid.length) {
			this.validationErrors.push('Invalid email(s): ' + invalid.join(', '));
		}
		if (this.validationErrors.length) {
			return;
		}
		if (this.editingTripId) {
			this.tripsService
				.updateTrip({
					id: this.editingTripId,
					name: this.newTrip.name,
					startDate: this.newTrip.startDate,
					endDate: this.newTrip.endDate,
					location: this.newTrip.location,
					assignedTo
				})
				.then(() => {
					this.showAddDialog = false;
					this.editingTripId = null;
					this.refresh();
					this.showToast('Trip updated successfully');
					this.loadingAction = null;
				});
		} else {
			this.tripsService
				.addTrip({
					name: this.newTrip.name,
					startDate: this.newTrip.startDate,
					endDate: this.newTrip.endDate,
					location: this.newTrip.location,
					assignedTo
				})
				.then(() => {
					this.showAddDialog = false;
					this.refresh();
					this.showToast('Trip added successfully');
					this.loadingAction = null;
				});
		}
	}

	buildKnownEmails() {
		const set = new Set<string>();
		for (const t of this.trips) {
			for (const e of t.assignedTo) set.add(e);
		}
		if (this.userEmail) set.add(this.userEmail);
		this.knownEmails = Array.from(set).sort();
	}

	addSuggestedEmail(email: string) {
		if (!email) return;
		const current = this.newTrip.assignedToText ? this.newTrip.assignedToText.split(',').map(e => e.trim()).filter(e => !!e) : [];
		if (!current.includes(email)) {
			current.push(email);
			this.newTrip.assignedToText = current.join(', ');
		}
	}

	editTrip(trip: TripSummary) {
		if (!this.isAdmin) return;
		this.inlineEditTrip = {
			name: trip.name,
			startDate: trip.startDate,
			endDate: trip.endDate,
			location: trip.location,
			assignedToText: trip.assignedTo.join(', ')
		};
		this.editingTripId = trip.id;
	}

	deleteTrip(trip: TripSummary) {
		if (!this.isAdmin) return;
		if (!confirm(`Delete trip "${trip.name}"?`)) return;
		this.loadingAction = 'Deleting trip...';
		this.tripsService.deleteTrip(trip.id).then(() => {
			this.refresh();
			this.showToast('Trip deleted');
			this.loadingAction = null;
		});
	}

	@HostListener('document:keydown', ['$event'])
	onKeyDown(ev: KeyboardEvent) {
		if (ev.key === 'Escape' && this.showAddDialog) {
			this.cancelAdd();
		}
	}

	onBackdropClick(ev: MouseEvent) {
		if ((ev.target as HTMLElement).classList.contains('dialog-backdrop')) {
			this.cancelAdd();
		}
	}

	// Inline editing handlers
	cancelInlineEdit() {
		this.inlineEditTrip = null;
		this.editingTripId = null;
	}

	saveInlineEdit(trip: TripSummary) {
		if (!this.inlineEditTrip) return;
		this.loadingAction = 'Updating trip...';
		const errors: string[] = [];
		if (!this.inlineEditTrip.name.trim()) errors.push('Name required');
		if (!this.inlineEditTrip.location.trim()) errors.push('Location required');
		if (this.inlineEditTrip.startDate && this.inlineEditTrip.endDate && this.inlineEditTrip.endDate < this.inlineEditTrip.startDate) errors.push('End before start');
		const assignedTo = this.inlineEditTrip.assignedToText.split(',').map(e => e.trim()).filter(e => !!e);
		const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
		const invalid = assignedTo.filter(e => !emailRegex.test(e));
		if (invalid.length) errors.push('Invalid: ' + invalid.join(', '));
		if (errors.length) {
			this.showToast(errors[0]);
			return;
		}
		this.tripsService.updateTrip({
			id: trip.id,
			name: this.inlineEditTrip.name,
			startDate: this.inlineEditTrip.startDate,
			endDate: this.inlineEditTrip.endDate,
			location: this.inlineEditTrip.location,
			assignedTo
		}).then(() => {
			this.showToast('Trip updated');
			this.cancelInlineEdit();
			this.refresh();
			this.loadingAction = null;
		});
	}

	removeAssignedEmail(email: string, dialog: boolean) {
		if (dialog) {
			const list = this.newTrip.assignedToText.split(',').map(e => e.trim()).filter(e => !!e && e !== email);
			this.newTrip.assignedToText = list.join(', ');
		} else if (this.inlineEditTrip) {
			const list = this.inlineEditTrip.assignedToText.split(',').map(e => e.trim()).filter(e => !!e && e !== email);
			this.inlineEditTrip.assignedToText = list.join(', ');
		}
	}

	// Toast helper
	showToast(msg: string) {
		this.toastMessage = msg;
		clearTimeout(this.toastTimer);
		this.toastTimer = setTimeout(() => (this.toastMessage = ''), 2500);
	}

	private loadListState() {
		try {
			const raw = localStorage.getItem(this.listStateKey);
			if (!raw) return;
			const parsed = JSON.parse(raw);
			if (parsed && typeof parsed === 'object') {
				if (typeof parsed.searchTerm === 'string') this.searchTerm = parsed.searchTerm;
				if (typeof parsed.pageSize === 'number') this.pageSize = parsed.pageSize;
				if (Array.isArray(parsed.selectedLocations)) this.selectedLocations = parsed.selectedLocations.filter((x: any) => typeof x === 'string');
			}
		} catch { /* ignore */ }
	}

	persistListState() {
		try {
			localStorage.setItem(this.listStateKey, JSON.stringify({ searchTerm: this.searchTerm, pageSize: this.pageSize, selectedLocations: this.selectedLocations }));
		} catch { /* ignore */ }
	}

	// Pagination helpers
	get filteredTrips(): TripSummary[] {
		const term = this.searchTerm.toLowerCase().trim();
		let base = this.trips;
		if (term) {
			base = base.filter(t => t.name.toLowerCase().includes(term) || t.location.toLowerCase().includes(term));
		}
		if (this.selectedLocations.length) {
			base = base.filter(t => this.selectedLocations.includes(t.location));
		}
		return base;
	}
	get totalPages(): number {
		return Math.ceil(this.filteredTrips.length / this.pageSize) || 1;
	}
	get displayedTrips(): TripSummary[] {
		const start = this.currentPage * this.pageSize;
		return this.filteredTrips.slice(start, start + this.pageSize);
	}
	ensurePageInRange() {
		if (this.currentPage >= this.totalPages) this.currentPage = this.totalPages - 1;
		if (this.currentPage < 0) this.currentPage = 0;
	}
	nextPage() { if (this.currentPage < this.totalPages - 1) { this.currentPage++; } }
	prevPage() { if (this.currentPage > 0) { this.currentPage--; } }
	changePageSize(size: number) { this.pageSize = size; this.currentPage = 0; this.ensurePageInRange(); }
	setPageSizePersisted(size: number) { this.changePageSize(size); this.persistListState(); }

	buildKnownLocations() {
		const set = new Set<string>();
		for (const t of this.trips) set.add(t.location);
		this.knownLocations = Array.from(set).sort();
	}
	toggleLocation(loc: string) {
		if (this.selectedLocations.includes(loc)) {
			this.selectedLocations = this.selectedLocations.filter(l => l !== loc);
		} else {
			this.selectedLocations = [...this.selectedLocations, loc];
		}
		this.currentPage = 0;
		this.ensurePageInRange();
		this.persistListState();
	}
	isLocationSelected(loc: string) { return this.selectedLocations.includes(loc); }
	clearLocationFilter() { this.selectedLocations = []; this.currentPage = 0; this.ensurePageInRange(); this.persistListState(); }

	// Debounce search
	private searchDebounceTimer: any;
	changeSearchTerm(term: string) {
		clearTimeout(this.searchDebounceTimer);
		this.searchDebounceTimer = setTimeout(() => {
			this.searchTerm = term;
			this.currentPage = 0;
			this.ensurePageInRange();
			this.persistListState();
		}, 300);
	}

	get inlineEditAssignedEmails(): string[] {
		if (!this.inlineEditTrip?.assignedToText) return [];
		return this.inlineEditTrip.assignedToText.split(',').map(e => e.trim()).filter(e => !!e);
	}

	get newTripAssignedEmails(): string[] {
		if (!this.newTrip.assignedToText) return [];
		return this.newTrip.assignedToText.split(',').map(e => e.trim()).filter(e => !!e);
	}

	// Email suggestions existing methods below
}
