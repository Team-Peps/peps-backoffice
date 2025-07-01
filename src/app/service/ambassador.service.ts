import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Ambassador, AmbassadorPayload} from '../model/ambassador';
import {environment} from '@/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AmbassadorService {

	constructor(
		private http: HttpClient
	) {}

	getAllAmbassadors(): Observable<Ambassador[]> {
		return this.http.get<Ambassador[]>(`${environment.backendUrl}/ambassador`);
	}

	updateAmbassador(payload: AmbassadorPayload): Observable<{ message: string; ambassador: Ambassador }> {

		const formData = new FormData();
		formData.append('ambassador', new Blob([JSON.stringify(payload.ambassador)], {type: 'application/json'}));
		formData.append('imageFile', payload.image);

		return this.http.put<{ message: string; ambassador: Ambassador }>(`${environment.backendUrl}/ambassador`, formData);
	}

	saveAmbassador(payload: AmbassadorPayload): Observable<{ message: string; ambassador: Ambassador }> {

		const formData = new FormData();
		formData.append('ambassador', new Blob([JSON.stringify(payload.ambassador)], {type: 'application/json'}));
		formData.append('imageFile', payload.image);

		return this.http.post<{ message: string; ambassador: Ambassador }>(`${environment.backendUrl}/ambassador`, formData);
	}

	deleteAmbassador(id: string): Observable<any> {
		return this.http.delete(`${environment.backendUrl}/ambassador/${id}`);
	}
}
