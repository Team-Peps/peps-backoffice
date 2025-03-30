import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment/environment';
import {Partner} from '../model/partner';
import {Observable} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PartnerService {

	constructor(
		private http: HttpClient
	) {}

	getPartners(): Observable<Record<string, Partner[]>> {
		return this.http.get<Record<string, Partner[]>>(`${environment.backendUrl}/partner`);
	}

	updatePartner(partner: Partner, imageFile: File): Observable<{ message: string, partner: Partner}> {
		const formData = new FormData();
		formData.append('partner', new Blob([JSON.stringify(partner)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);

		return this.http.put<{ message: string, partner: Partner}>(`${environment.backendUrl}/partner`, formData);
	}

	savePartner(partner: Partner, imageFile: File): Observable<{ message: string, partner: Partner}> {
		const formData = new FormData();
		formData.append('partner', new Blob([JSON.stringify(partner)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);

		return this.http.post<{ message: string, partner: Partner}>(`${environment.backendUrl}/partner`, formData);
	}

	deletePartner(id: string): Observable<any> {
		return this.http.delete(`${environment.backendUrl}/partner/${id}`);
	}

	toggleActive(id: string): Observable<any> {
		return this.http.post(`${environment.backendUrl}/partner/${id}/active`, {});
	}
}
