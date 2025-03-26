import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environment/environment';
import {MatchFinishedDto, MatchFormUpcoming} from '../model/match/match';
import {catchError, Observable} from 'rxjs';
import {handleError} from './handleError';

@Injectable({
	providedIn: 'root'
})
export class MatchService {

	constructor(
		private http: HttpClient
	) {}

	createUpcomingMatch(match: MatchFormUpcoming): Observable<{ message: string }> {
		return this.http.post<{ message: string }>(`${environment.backendUrl}/match/upcoming`, match)
			.pipe(
				catchError(handleError)
			);
	}

    createFinishedMatch(matchDto: MatchFinishedDto): Observable<{ message: string }> {
		return this.http.post<{ message: string }>(`${environment.backendUrl}/match/finished`, matchDto)
			.pipe(
				catchError(handleError)
			);
    }
}
