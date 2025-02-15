import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-sidebar',
	imports: [
		RouterLink,
		NgClass
	],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
	isSidebarOpen = false;

	toggleSidebar() {
		this.isSidebarOpen = !this.isSidebarOpen;
	}
}
