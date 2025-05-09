import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User} from '../../model/auth/user';
import {AuthService} from '../../service/auth.service';
import {NgOptimizedImage} from '@angular/common';

@Component({
	selector: 'app-login',
	imports: [
		ReactiveFormsModule,
		NgOptimizedImage
	],
	templateUrl: './login.component.html',
})
export class LoginComponent {

	constructor(
		private readonly authService: AuthService
	) {}

	form: FormGroup = new FormGroup({
		username: new FormControl('', Validators.required),
		password: new FormControl('', Validators.required)
	});

	onSubmit() {
		if(!this.form.valid) {
			return;
		}

		const user: User = {
			username: this.form.value.username,
			password: this.form.value.password,
		}

		this.authService.login(user);
	}

}
