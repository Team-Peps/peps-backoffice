import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Member, PepsMember} from '../model/member/member';
import {environment} from '../../environment/environment';
import {catchError, Observable} from 'rxjs';
import {User} from '../model/auth/user';
import {handleError} from './handleError';

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

	getMembersWithoutRoster(): Observable<Member[]> {
		return this.http.get<Member[]>(`${environment.backendUrl}/member/without-roster`);
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

	removeMemberFromRoster(memberId: string): Observable<{ message: string; memberId: string }> {
		return this.http.delete<{ message: string; memberId: string }>(`${environment.backendUrl}/member/${memberId}/roster`)
			.pipe(
				catchError(handleError)
			);
	}

	addMemberToRoster(memberId: string, rosterId: string): Observable<{ message: string; memberId: string }> {
		return this.http.post<{ message: string; memberId: string }>(`${environment.backendUrl}/member/${memberId}/roster/${rosterId}`, null)
			.pipe(
				catchError(handleError)
			);
	}

}
