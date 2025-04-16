import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Member} from '../model/member/member';
import {environment} from '../../environment/environment';
import {Observable} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MemberService {

	constructor(
		private http: HttpClient
	) {}

	getMembers(game: String): Observable<Record<string, Member[]>> {
		return this.http.get<Record<string, Member[]>>(`${environment.backendUrl}/member/game/` + game);
	}

	updateMember(member: Member, imageFile: File): Observable<{ message: string; member: Member }> {

		const formData = new FormData();
		formData.append('member', new Blob([JSON.stringify(member)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);

		return this.http.put<{ message: string; member: Member }>(`${environment.backendUrl}/member`, formData);
	}

	saveMember(member: Member, imageFile: File): Observable<{ message: string; member: Member }> {

		const formData = new FormData();
		formData.append('member', new Blob([JSON.stringify(member)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);

		return this.http.post<{ message: string; member: Member }>(`${environment.backendUrl}/member`, formData);
	}

	deleteMember(id: string): Observable<any> {
		return this.http.delete(`${environment.backendUrl}/member/${id}`);
	}

	toggleActive(id: string): Observable<any> {
		return this.http.post(`${environment.backendUrl}/member/${id}/active`, {});
	}

	toggleSubstitute(id: string): Observable<any> {
		return this.http.post(`${environment.backendUrl}/member/${id}/substitute`, {});
	}

}
