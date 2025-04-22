import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import {NotAuthenticatedGuard} from './guard/not-authenticated.guard';
import {AuthenticatedGuard} from './guard/authenticated.guard';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {ManageUserComponent} from './pages/manage-user/manage-user.component';
import {MemberListComponent} from './pages/member/member-list/member-list.component';
import {MatchListComponent} from './pages/match/match-list/match-list.component';
import {PartnerListComponent} from './pages/partner/partner-list/partner-list.component';
import {HeroeListComponent} from './pages/heroe/heroe-list/heroe-list.component';
import {ArticleListComponent} from './pages/article/article-list/article-list.component';
import {AmbassadorListComponent} from './pages/ambassador/ambassador-list/ambassador-list.component';
import {AchievementListComponent} from './pages/achievement/achievement-list/achievement-list.component';
import {SliderListComponent} from './pages/slider/slider-list/slider-list.component';
import {LastVideoListComponent} from '@/app/pages/last-video/last-video-list/last-video-list.component';

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
			},
			{
				path: 'partners',
				component: PartnerListComponent
			},
			{
				path: 'articles',
				component: ArticleListComponent
			},
			{
				path: 'ambassadors',
				component: AmbassadorListComponent
			},
			{
				path: 'achievements',
				component: AchievementListComponent,
			},
			{
				path: 'sliders',
				component: SliderListComponent,
			},
			{
				path: 'last-videos',
				component: LastVideoListComponent
			}
		]
	},
	{
		path: 'heroes',
		canActivate: [AuthenticatedGuard],
		component: HeroeListComponent
	},
	{
		path: 'statistics',
		component: HomeComponent,
		canActivate: [AuthenticatedGuard]
	},
	{
		path: 'orders',
		component: HomeComponent,
		canActivate: [AuthenticatedGuard]
	},
	{
		path: 'users',
		component: ManageUserComponent,
		canActivate: [AuthenticatedGuard]
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [NotAuthenticatedGuard]
	},
	{
		path: '**',
		component: PageNotFoundComponent
	}
];
