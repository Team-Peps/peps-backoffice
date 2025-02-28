import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Member} from '../model/member';
import {environment} from '../../environment/environment';
import {Observable} from 'rxjs';
import {User} from '../model/user';

@Injectable({
	providedIn: 'root'
})
export class MemberService {

	constructor(
		private http: HttpClient
	) {}

	getMembers(): Observable<Member[]> {
		return this.http.get<Member[]>(`${environment.backendUrl}/member`);
	}

	updateMember(member: Member): Observable<{ message: string; user: User }> {
		return this.http.put<{ message: string; user: User }>(`${environment.backendUrl}/member`, member);
	}

	saveMember(member: Member): Observable<{ message: string; user: User }> {
		return this.http.post<{ message: string; user: User }>(`${environment.backendUrl}/member`, member);
	}
}
