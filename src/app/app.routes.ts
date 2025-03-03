import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import {NotAuthenticatedGuard} from './guard/not-authenticated.guard';
import {AuthenticatedGuard} from './guard/authenticated.guard';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {ManageUserComponent} from './pages/manage-user/manage-user.component';
import {RosterDetailsComponent} from './pages/roster/roster-details/roster-details.component';
import {RosterListComponent} from './pages/roster/roster-list/roster-list.component';
import {PepsMemberListComponent} from './pages/member/peps-member-list/peps-member-list.component';

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
		path: 'management',
		canActivate: [AuthenticatedGuard],
		children: [
			{
				path: 'rosters',
				children: [
					{
						path: '',
						component: RosterListComponent,
					},
					{
						path: ':id',
						component: RosterDetailsComponent,
					}
				]
			},
			{
				path: 'members',
				component: PepsMemberListComponent,
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
