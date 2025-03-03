import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment/environment';
import {User} from '../model/auth/user';
import {Observable} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor(
		private http: HttpClient,
	) {}

	getUsers() {
		return this.http.get<User[]>(`${environment.backendUrl}/user`);
	}

	disableUser(id: string): Observable<{ message: string; user: User }> {
		return this.http.put<{ message: string; user: User }>(
			`${environment.backendUrl}/user/disable`,
			{ id }
		);
	}

	enableUser(id: string): Observable<{ message: string; user: User }> {
		return this.http.put<{ message: string; user: User }>(
			`${environment.backendUrl}/user/enable`,
			{ id }
		);
	}

	changeUserRole(id: string, role: string): Observable<{ message: string; user: User }> {
		return this.http.put<{ message: string; user: User }>(
			`${environment.backendUrl}/user/change-role`,
			{ id, role}
		);
	}


}
