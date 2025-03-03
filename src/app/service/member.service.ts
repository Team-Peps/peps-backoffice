import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Member, PepsMember} from '../model/member/member';
import {environment} from '../../environment/environment';
import {Observable} from 'rxjs';
import {User} from '../model/auth/user';

@Injectable({
	providedIn: 'root'
})
export class MemberService {

	constructor(
		private http: HttpClient
	) {}

	getPepsMembers(): Observable<PepsMember[]> {
		return this.http.get<PepsMember[]>(`${environment.backendUrl}/member/peps`);
	}

	updatePepsMember(member: PepsMember): Observable<{ message: string; user: User }> {
		return this.http.put<{ message: string; user: User }>(`${environment.backendUrl}/member/peps`, member);
	}

	savePepsMember(member: PepsMember): Observable<{ message: string; user: User }> {
		return this.http.post<{ message: string; user: User }>(`${environment.backendUrl}/member/peps`, member);
	}
}
