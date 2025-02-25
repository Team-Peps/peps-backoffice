import {Component} from '@angular/core';
import {UserService} from '../service/user.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../model/user';
import {AsyncPipe, LowerCasePipe, NgClass, TitleCasePipe} from '@angular/common';
import {AuthService} from '../service/auth.service';
import {ToastService} from '../service/toast.service';
import {Authority} from '../model/authority';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TooltipDirective} from '../core/components/tooltip/tooltip.directive';

@Component({
  selector: 'app-manage-user',
	imports: [
		AsyncPipe,
		NgClass,
		TitleCasePipe,
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
	protected readonly enumKeysAuthority = enumKeysAuthority;
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

	changeRole(value: any, id: string): void {
		this.userService.changeUserRole(id, value.target.value).subscribe({
			next: (response) => {
				this.loadUsers();
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la modification du rôle :", error);
				this.toastService.show('Une erreur est survenue', 'success');
			}
		});

	}
}

function enumKeysAuthority<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
	return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}
