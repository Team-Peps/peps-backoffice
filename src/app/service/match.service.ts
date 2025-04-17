import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Match} from '../model/match';
import {environment} from '@/environments/environment';

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
