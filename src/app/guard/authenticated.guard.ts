import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../service/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthenticatedGuard  {

	constructor(
		private readonly authService: AuthService,
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if(this.authService.isAuthenticated()){
			return true;
		}
		this.authService.logout();
		return false;
	}

	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.canActivate(childRoute, state);
	}
}
