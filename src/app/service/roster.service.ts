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

	getPepsRosters(): Observable<Roster[]> {
		return this.http.get<Roster[]>(`${environment.backendUrl}/roster/peps`);
	}

	getRoster(id: string): Observable<Roster> {
		return this.http.get<Roster>(`${environment.backendUrl}/roster/${id}`);
	}

	getOpponentRosters() {
		return this.http.get<Roster[]>(`${environment.backendUrl}/roster/opponent`);
	}

	createRoster(roster: Roster, imageFile: File): Observable<Roster> {
		const formData = new FormData();
		formData.append('roster', new Blob([JSON.stringify(roster)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);

		return this.http.post<Roster>(`${environment.backendUrl}/roster`, formData);
	}

	deleteRoster(roster: Roster): Observable<void> {
		return this.http.delete<void>(`${environment.backendUrl}/roster/${roster.id}`);
	}

	updateRoster(roster: Roster, imageFile: File): Observable<Roster> {
		const formData = new FormData();
		formData.append('roster', new Blob([JSON.stringify(roster)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);
		return this.http.put<Roster>(`${environment.backendUrl}/roster`, formData);
	}
}
