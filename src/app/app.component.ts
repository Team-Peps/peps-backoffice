import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SidebarComponent} from './core/components/sidebar/sidebar.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	imports: [
		RouterOutlet,
		SidebarComponent
	]
})
export class AppComponent {
  title = 'peps-backoffice';

  constructor(public router: Router) {
  }
}
