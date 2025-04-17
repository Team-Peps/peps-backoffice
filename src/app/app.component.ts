import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './core/components/navbar/navbar.component';
import {AuthService} from './service/auth.service';
import {environment} from '@/environments/environment';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	imports: [
		RouterOutlet,
		NavbarComponent
	]
})
export class AppComponent {
  title = 'peps-backoffice';

  constructor(
	  public router: Router,
	  protected readonly authService: AuthService
  ) {}
}
