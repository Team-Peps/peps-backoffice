import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Roster} from '../model/roster';
import {environment} from '../../environment/environment';

@Injectable({
	providedIn: 'root'
})
export class RosterService {

	constructor(
		private http: HttpClient
	) {}

	getRosters(): Observable<Roster[]> {
		return this.http.get<Roster[]>(`${environment.backendUrl}/roster`);
	}

	getRoster(id: string): Observable<Roster> {
		return this.http.get<Roster>(`${environment.backendUrl}/roster/${id}`);
	}
}
