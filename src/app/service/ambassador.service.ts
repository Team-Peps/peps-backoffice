import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environment/environment';
import {Ambassador} from '../model/ambassador';

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

	updateAmbassador(ambassador: Ambassador, imageFile: File): Observable<{ message: string; ambassador: Ambassador }> {

		const formData = new FormData();
		formData.append('ambassador', new Blob([JSON.stringify(ambassador)], {type: 'application/json'}));
		formData.append('imageFile', imageFile);

		return this.http.put<{ message: string; ambassador: Ambassador }>(`${environment.backendUrl}/ambassador`, formData);
	}

	saveAmbassador(ambassador: Ambassador, imageFile: File): Observable<{ message: string; ambassador: Ambassador }> {

		const formData = new FormData();
		formData.append('ambassador', new Blob([JSON.stringify(ambassador)], {type: 'application/json'}));
		formData.append('imageFile', imageFile);

		return this.http.post<{ message: string; ambassador: Ambassador }>(`${environment.backendUrl}/ambassador`, formData);
	}

	deleteAmbassador(id: string): Observable<any> {
		return this.http.delete(`${environment.backendUrl}/ambassador/${id}`);
	}
}
