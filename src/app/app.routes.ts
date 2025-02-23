import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {NotAuthenticatedGuard} from './guard/not-authenticated.guard';
import {AuthenticatedGuard} from './guard/authenticated.guard';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: HomeComponent, canActivate: [AuthenticatedGuard] },
	{ path: 'edit', component: HomeComponent, canActivate: [AuthenticatedGuard] },
	{ path: 'statistics', component: HomeComponent, canActivate: [AuthenticatedGuard] },
	{ path: 'orders', component: HomeComponent, canActivate: [AuthenticatedGuard] },
	{ path: 'users', component: HomeComponent, canActivate: [AuthenticatedGuard] },
	{ path: 'login', component: LoginComponent, canActivate: [NotAuthenticatedGuard] },
	{path: '**', component: PageNotFoundComponent}

];
