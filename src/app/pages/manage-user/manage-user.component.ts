import {Component} from '@angular/core';
import {UserService} from '../../service/user.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../../model/auth/user';
import {AsyncPipe, NgClass} from '@angular/common';
import {AuthService} from '../../service/auth.service';
import {ToastService} from '../../service/toast.service';
import {Authority} from '../../model/auth/authority';
import {ReactiveFormsModule} from '@angular/forms';
import {TooltipDirective} from '../../core/components/tooltip/tooltip.directive';
import {enumKeysObject} from '../../core/utils/enum';

@Component({
  selector: 'app-manage-user',
	imports: [
		AsyncPipe,
		NgClass,
		ReactiveFormsModule,
		TooltipDirective,
	],
  templateUrl: './manage-user.component.html',
})
export class ManageUserComponent {

	constructor(
		private readonly userService: UserService,
		protected readonly authService: AuthService,
		private readonly toastService: ToastService
	) {
		this.loadUsers();
	}

	protected readonly Authority = Authority;
	protected readonly enumKeysObject = enumKeysObject;
	private usersSubject = new BehaviorSubject<User[]>([]);
	users$: Observable<User[]> = this.usersSubject.asObservable();

	loadUsers(): void {
		this.userService.getUsers().subscribe(users => {
			this.usersSubject.next(users);
		});
	}

	enableUser(id: string): void {
		this.userService.enableUser(id).subscribe({
			next: (response) => {
				this.loadUsers();
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de l'activation :", error);
				this.toastService.show('Une erreur est survenue', 'success');

			}
		});
	}

	disableUser(id: string): void {
		this.userService.disableUser(id).subscribe({
			next: (response) => {
				this.loadUsers();
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la désactivation :", error);
				this.toastService.show('Une erreur est survenue', 'success');
			}
		});
	}

}
