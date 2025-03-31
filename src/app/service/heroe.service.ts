import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environment/environment';
import {Heroe} from '../model/heroe';

@Injectable({
	providedIn: 'root'
})
export class HeroeService {

	constructor(
		private http: HttpClient
	) {}

	getAllHeroes(): Observable<Record<string, Heroe[]>> {
		return this.http.get<Record<string, Heroe[]>>(`${environment.backendUrl}/heroe`);
	}

	updateHeroe(heroe: Heroe, imageFile: File): Observable<{ message: string, heroe: Heroe}> {
		const formData = new FormData();
		formData.append('heroe', new Blob([JSON.stringify(heroe)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);

		return this.http.put<{ message: string, heroe: Heroe}>(`${environment.backendUrl}/heroe`, formData);
	}

	saveHeroe(heroe: Heroe, imageFile: File): Observable<{ message: string, heroe: Heroe}> {
		const formData = new FormData();
		formData.append('heroe', new Blob([JSON.stringify(heroe)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);

		return this.http.post<{ message: string, heroe: Heroe}>(`${environment.backendUrl}/heroe`, formData);
	}
}
