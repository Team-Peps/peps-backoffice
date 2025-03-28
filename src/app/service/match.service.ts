import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment/environment';
import {Observable} from 'rxjs';
import {Match} from '../model/match/match';

@Injectable({
	providedIn: 'root'
})
export class MatchService {

	constructor(
		private http: HttpClient
	) {}

	getAllMatches(): Observable<Record<string, Match[]>> {
		return this.http.get<Record<string, Match[]>>(`${environment.backendUrl}/match`);
	}
}
