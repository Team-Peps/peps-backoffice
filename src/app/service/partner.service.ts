import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Partner, PartnerPayload} from '../model/partner';
import {Observable} from 'rxjs';
import {environment} from '@/environments/environment';

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

	updatePartner(payload: PartnerPayload): Observable<{ message: string, partner: Partner}> {
		const formData = new FormData();
		formData.append('partner', new Blob([JSON.stringify(payload.partner)], { type: 'application/json' }));
		formData.append('imageFile', payload.image);

		return this.http.put<{ message: string, partner: Partner}>(`${environment.backendUrl}/partner`, formData);
	}

	savePartner(payload: PartnerPayload): Observable<{ message: string, partner: Partner}> {
		const formData = new FormData();
		formData.append('partner', new Blob([JSON.stringify(payload.partner)], { type: 'application/json' }));
		formData.append('imageFile', payload.image);

		return this.http.post<{ message: string, partner: Partner}>(`${environment.backendUrl}/partner`, formData);
	}

	deletePartner(id: string): Observable<any> {
		return this.http.delete(`${environment.backendUrl}/partner/${id}`);
	}

	toggleActive(id: string): Observable<any> {
		return this.http.post(`${environment.backendUrl}/partner/${id}/active`, {});
	}

	updateOrder(orderedIds: string[]): Observable<any> {
		return this.http.put(`${environment.backendUrl}/partner/reorder`, orderedIds);
	}
}
