import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from './core/components/sidebar/sidebar.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	imports: [
		RouterOutlet,
		SidebarComponent
	],
	styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'peps-backoffice';
}
