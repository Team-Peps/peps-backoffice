import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';

export const routes: Routes = [
		{ path: 'dashboard', component: HomeComponent },
	{ path: 'edit', component: HomeComponent },
	{ path: 'statistics', component: HomeComponent },
	{ path: 'orders', component: HomeComponent },
	{ path: 'users', component: HomeComponent },
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
