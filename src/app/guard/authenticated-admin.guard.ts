import {Injectable} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthenticatedAdminGuard  {

	constructor(
		private readonly authService: AuthService,
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if(this.authService.isAuthenticated() && this.authService.isAdmin()){
			return true;
		}
		this.authService.logout();
		return false;
	}

	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.canActivate(childRoute, state);
	}
}
