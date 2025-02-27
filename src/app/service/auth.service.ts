import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Authenticate} from '../model/authenticate';
import {User} from '../model/user';
import {environment} from '../../environment/environment';
import {Router} from '@angular/router';
import {catchError, Observable, tap} from 'rxjs';
import {Injectable} from '@angular/core';
import {Authority} from '../model/authority';

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
		this.http.post(`${environment.backendUrl}/auth/logout`, {}).subscribe(
			() => {
				this.destroyToken();
				this.router.navigate(['/login']);
			}
		);
	}

	getToken(): string {
		return <string>sessionStorage.getItem('token');
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
		return this.http.post<Authenticate>(`${environment.backendUrl}/auth/refresh-token`, {}, {headers}).pipe(
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
		return !!this.getToken();
	}

	isAdmin(): boolean {
		const token = this.getToken();
		if (!token) {
			return false;
		}

		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			const authorities: Authority[] = payload.authorities || [];

			return authorities.some((authority: Authority) => authority === Authority.ADMIN);
		} catch (error) {
			console.error('Error parsing token:', error);
			return false;
		}
	}

	getUsername(): string {
		const token = this.getToken();
		if (!token) {
			return '';
		}

		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.sub;
		} catch (error) {
			console.error('Error parsing token:', error);
			return '';
		}
	}


}
