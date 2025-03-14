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

	createOpponentRoster(roster: Roster): Observable<Roster> {
		return this.http.post<Roster>(`${environment.backendUrl}/roster/opponent`, roster);
	}

	deleteOpponentRoster(roster: Roster): Observable<void> {
		return this.http.delete<void>(`${environment.backendUrl}/roster/opponent/${roster.id}`);
	}

	updateOpponentRoster(roster: Roster): Observable<Roster> {
		return this.http.put<Roster>(`${environment.backendUrl}/roster/opponent/${roster.id}`, roster);
	}
}
