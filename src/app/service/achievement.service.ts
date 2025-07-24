import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Achievement} from '../model/achievement';
import {Game} from '../model/game';
import {environment} from '@/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AchievementService {

	constructor(
		private http: HttpClient
	) {}

	getAllAchievementByGame(game: Game): Observable<Achievement[]> {
		return this.http.get<Achievement[]>(`${environment.backendUrl}/achievement/game/${game}`);
	}

	createGameAchievement(achievement: Achievement): Observable<{ message: string; achievement: Achievement }> {
		return this.http.post<{ message: string; achievement: Achievement }>(`${environment.backendUrl}/achievement`, achievement);
	}

	deleteAchievement(id: string): Observable<any> {
		return this.http.delete(`${environment.backendUrl}/achievement/${id}`);
	}

	updateGameAchievement(achievement: Achievement): Observable<{ message: string; achievement: Achievement }> {
		return this.http.put<{ message: string; achievement: Achievement }>(`${environment.backendUrl}/achievement/${achievement.id}`, achievement);
	}
}
