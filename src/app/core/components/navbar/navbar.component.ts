import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../service/auth.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-navbar',
	imports: [
		RouterLink,
		NgClass,
	],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

	constructor(
		protected readonly authService: AuthService,
		private readonly router: Router
	) {}

	isMobileMenuOpen = false;
	isProfilDropdownOpen = false;
	isMobileDropdownOpen = false;

	toggleMobileMenu() {
		this.isMobileMenuOpen = !this.isMobileMenuOpen;
	}

	toggleProfilDropdown() {
		this.isProfilDropdownOpen = !this.isProfilDropdownOpen;
	}

	toggleMobileDropdown() {
		this.isMobileDropdownOpen = !this.isMobileDropdownOpen;
	}

	logout() {
		this.authService.logout();
	}

	isActive(path: string) {
		return this.router.url.includes(path);
	}
}
