import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {NotAuthenticatedGuard} from './guard/not-authenticated.guard';
import {AuthenticatedGuard} from './guard/authenticated.guard';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ManageUserComponent} from './manage-user/manage-user.component';
import {RostersComponent} from './rosters/rosters.component';
import {RosterDetailsComponent} from './roster-details/roster-details.component';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'},
	{
		path: 'dashboard',
		component: HomeComponent,
		canActivate: [AuthenticatedGuard]},
	{
		path: 'edit',
		canActivate: [AuthenticatedGuard],
		children: [
			{
				path: 'rosters',
				children: [
					{
						path: '',
						component: RostersComponent,
					},
					{
						path: ':id',
						component: RosterDetailsComponent,
					}
				]
			},
			{
				path: 'members',
				component: HomeComponent,
			}
		]
	},
	{
		path: 'statistics',
		component: HomeComponent,
		canActivate: [AuthenticatedGuard]},
	{
		path: 'orders',
		component: HomeComponent,
		canActivate: [AuthenticatedGuard]},
	{
		path: 'users',
		component: ManageUserComponent,
		canActivate: [AuthenticatedGuard]},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [NotAuthenticatedGuard]},
	{
		path: '**',
		component: PageNotFoundComponent}

];
