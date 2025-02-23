import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';
import {AuthService} from '../../../service/auth.service';

@Component({
  selector: 'app-sidebar',
	imports: [
		RouterLink,
		NgClass
	],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

	constructor(
		protected readonly authService: AuthService
	) {}

	isSidebarOpen = false;

	toggleSidebar() {
		this.isSidebarOpen = !this.isSidebarOpen;
	}

	logout() {
		this.authService.logout();
	}
}
