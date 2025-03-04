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

	updatePepsMember(member: PepsMember, imageFile: File): Observable<{ message: string; user: User }> {

		const formData = new FormData();
		formData.append('member', new Blob([JSON.stringify(member)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);

		return this.http.put<{ message: string; user: User }>(`${environment.backendUrl}/member/peps`, formData);
	}

	savePepsMember(member: PepsMember, imageFile: File): Observable<{ message: string; user: User }> {

		const formData = new FormData();
		formData.append('member', new Blob([JSON.stringify(member)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);

		return this.http.post<{ message: string; user: User }>(`${environment.backendUrl}/member/peps`, formData);
	}
}
