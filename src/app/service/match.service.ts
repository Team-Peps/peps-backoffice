import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Match} from '../model/match';
import {environment} from '@/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class MatchService {

	constructor(
		private http: HttpClient,
		private ngZone: NgZone
	) {}

	getAllMatches(): Observable<Record<string, Match[]>> {
		return this.http.get<Record<string, Match[]>>(`${environment.backendUrl}/match`);
	}

	updateAndSaveMatches(): Observable<string> {
		return new Observable<string>((observer) => {
			const eventSource = new EventSource(`${environment.backendUrl}/match/update-and-save`);

			eventSource.onmessage = (event: MessageEvent) => {
				this.ngZone.run(() => {
					observer.next(event.data);
				})
			};

			eventSource.onerror = (error: Event) => {
				this.ngZone.run(() => {
					observer.error(error);
				});
				eventSource.close();
			};

			return () => eventSource.close();
		})
	}

	updateVodUrl(matchId: string, vodUrl: string): Observable<{ message: string; match: Match }> {
		return this.http.put<{ message: string; match: Match }>(`${environment.backendUrl}/match/vod-url/${matchId}`, vodUrl);
	}
}
