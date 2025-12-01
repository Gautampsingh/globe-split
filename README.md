# FuturaSplit

An Angular 18 standalone app scaffold with feature-based structure. Includes reactive expenses management, currency conversion, and local country flags.

## Project Structure

- `src/app/core/` — shared domain logic
	- `guards/` — `auth.guard.ts`, `admin.guard.ts`
	- `services/` — `auth.service.ts`, `trips.service.ts`, `expenses.service.ts`, `users.service.ts`
	- `models/` — interfaces like `expense.model.ts`, `trip.model.ts`, `user.model.ts`
- `src/app/shared/` — UI and utilities
	- `components/navbar/` — app navigation
	- `ui/` — simple UI primitives (button, card)
	- `pipes/` — `currency-format.pipe.ts`
- `src/app/features/` — feature modules
	- `login/` — login form with inline validation
	- `dashboards/` — user/admin dashboards
	- `trips/` — trips listing and placeholders
	- `expenses/` — add/list flow, cards, local flags
		- `add-expense/` — responsive form with datalist currency autocomplete and flag preview
		- `expense-list/` — list with “Convert to” toggle and target currency select
		- `expense-card/` — mobile-friendly card showing amount, currency, flag, description, date
- `src/assets/flags/` — local SVG flags (ISO-like codes e.g., `us.svg`, `gb.svg`, `eu.svg`)
- `src/app/app.routes.ts` — lazy routes with guards
- `src/app/app.component.*` — app shell (navbar + router-outlet)
- `src/main.ts` — bootstrapApplication + provideRouter
- `src/index.html` — app root with `<base href="/">`

## Features

- Standalone Angular components and routing
- Route guards for auth and admin
- Expenses service with localStorage persistence
- Add Expense:
	- Responsive flex table-like layout
	- Inline validation for required fields
	- Currency autocomplete via `<datalist>` with flag hint
	- Dates normalized to `dd-MM-yyyy`
- Expense List:
	- Mobile-friendly cards
	- “Convert to” toggle with static FX rates and target currency selector
- Local country flags loaded from `src/assets/flags`

## Scripts

PowerShell (Windows):

```
npm install
npm run start
npm run build
```

Notes:
- The dev server runs with Angular CLI. If start fails, ensure you’re in the project folder: `c:\Projects\Extras\futura-split\futura-split`.
- Add more flags by placing SVGs under `src/assets/flags` and mapping currency code → country code in the components.
- Static FX rates are sample values; replace with live rates if needed.

## Routing

- `/login` — public
- `/dashboard`, `/trips`, `/expenses`, `/users` — guarded by `authGuard`
- `/admin` — guarded by `adminGuard`

## Development Tips

- If you see “Can’t bind to 'ngModel'” errors, ensure `FormsModule` is imported in the standalone component.
- For SPA deep-link issues, `index.html` includes `<base href="/">`.
- Zone.js is imported in `main.ts` to avoid NG0908.
