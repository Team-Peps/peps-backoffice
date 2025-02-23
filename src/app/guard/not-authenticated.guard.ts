import {Injectable} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class NotAuthenticatedGuard  {

	constructor(
		private readonly authService: AuthService,
		private readonly router: Router
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if(!this.authService.isAuthenticated()){
			return true;
		}
		this.router.navigate(['home']);
		return false;
	}

	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.canActivate(childRoute, state);
	}
}
