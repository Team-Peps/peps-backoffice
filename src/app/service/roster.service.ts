import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Roster, RosterTiny} from '../model/roster';
import {environment} from '../../environment/environment';

@Injectable({
	providedIn: 'root'
})
export class RosterService {

	constructor(
		private http: HttpClient
	) {}

	getRoster(id: string): Observable<Roster> {
		return this.http.get<Roster>(`${environment.backendUrl}/roster/${id}`);
	}

	getPepsRosters(): Observable<Roster[]> {
		return this.http.get<Roster[]>(`${environment.backendUrl}/roster/peps`);
	}

	getOpponentRosters() {
		return this.http.get<Roster[]>(`${environment.backendUrl}/roster/opponent`);
	}

	getPepsRostersTiny(): Observable<RosterTiny[]> {
		return this.http.get<RosterTiny[]>(`${environment.backendUrl}/roster/peps/tiny`);
	}

	getOpponentRostersTiny(): Observable<RosterTiny[]> {
		return this.http.get<RosterTiny[]>(`${environment.backendUrl}/roster/opponent/tiny`);
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
