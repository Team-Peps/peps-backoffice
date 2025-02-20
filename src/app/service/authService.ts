import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Authenticate} from '../model/authenticate';
import {User} from '../model/user';
import {environment} from '../../environment/environment';
import {Router} from '@angular/router';
import {catchError, Observable, tap} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(
		private http: HttpClient,
		private readonly router: Router
	) {}


	login(user: User) {
		this.http.post<Authenticate>(`${environment.backendUrl}/auth/authenticate`, user).subscribe(
			(authenticate: Authenticate) => {
				sessionStorage.setItem('token', authenticate.access_token);
				sessionStorage.setItem('refreshToken', authenticate.refresh_token);
				this.router.navigate(['/dashboard']);
			}
		);
	}

	logout() {
		this.destroyToken();
		this.router.navigate(['/login']);
	}

	private destroyToken() {
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('refreshToken');
	}

	refreshToken(): Observable<any> {
		const refreshToken = sessionStorage.getItem('refreshToken');

		if(!refreshToken) {
			this.logout();
		}

		const headers = new HttpHeaders({
			Authorization: `Bearer ${refreshToken}`,
			'Content-Type': 'application/json'
		});
		return this.http.post<Authenticate>(`${environment.backendUrl}/auth/refresh`, {}, {headers}).pipe(
			tap((tokens: Authenticate) => {
				sessionStorage.setItem('token', tokens.access_token);
				sessionStorage.setItem('refreshToken', tokens.refresh_token);
			}),
			catchError((error) => {
				this.logout();
				throw error;
			})
		);

	}

	isAuthenticated(): boolean {
		return !!sessionStorage.getItem('token');
	}

}
