import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import {NotAuthenticatedGuard} from './guard/not-authenticated.guard';
import {AuthenticatedGuard} from './guard/authenticated.guard';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {ManageUserComponent} from './pages/manage-user/manage-user.component';
import {MemberListComponent} from './pages/member/member-list/member-list.component';
import {MatchListComponent} from './pages/match/match-list/match-list.component';
import {DataOverwatchComponent} from './pages/data/overwatch/data-overwatch.component';
import {DataMarvelRivalsComponent} from './pages/data/marvel-rivals/data-marvel-rivals.component';

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
				path: 'members',
				component: MemberListComponent,
			},
			{
				path: 'matches',
				component: MatchListComponent
			}
		]
	},
	{
		path: 'data',
		canActivate: [AuthenticatedGuard],
		children: [
			{
				path: 'overwatch',
				component: DataOverwatchComponent
			},
			{
				path: 'marvel-rivals',
				component: DataMarvelRivalsComponent
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
