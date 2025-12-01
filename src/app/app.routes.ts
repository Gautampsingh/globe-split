import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },

	// Auth & Login
	{ path: 'login', loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },

	// Dashboards
	{ path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./features/dashboard/user/user-dashboard.component').then(m => m.UserDashboardComponent) },
	{ path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./features/dashboard/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },

	// Trips
	{ path: 'trips', canActivate: [authGuard], loadComponent: () => import('./features/trips/trips-list/trips-list.component').then(m => m.TripsListComponent) },
	{ path: 'trips/:id', canActivate: [authGuard], loadComponent: () => import('./features/trips/trip-details/trip-details.component').then(m => m.TripDetailsComponent) },
	{ path: 'trips/access', canActivate: [authGuard], loadComponent: () => import('./features/trips/trip-access/trip-access.component').then(m => m.TripAccessComponent) },

	// Expenses
	{ path: 'expenses', canActivate: [authGuard], loadComponent: () => import('./features/expenses/expense-list/expense-list.component').then(m => m.ExpenseListComponent) },
	{ path: 'expenses/add', canActivate: [authGuard], loadComponent: () => import('./features/expenses/add-expense/add-expense.component').then(m => m.AddExpenseComponent) },
	{ path: 'expenses/card', canActivate: [authGuard], loadComponent: () => import('./features/expenses/expense-card/expense-card.component').then(m => m.ExpenseCardComponent) },

	// Users
	{ path: 'profile', canActivate: [authGuard], loadComponent: () => import('./features/users/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
	{ path: 'admin/users', canActivate: [adminGuard], loadComponent: () => import('./features/users/user-admin-list/user-admin-list.component').then(m => m.UserAdminListComponent) },

	// Fallback
	{ path: '**', redirectTo: 'dashboard' }
];

