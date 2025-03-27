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

	getAllHeroesOfGame(game: string): Observable<Heroe[]> {
		return this.http.get<Heroe[]>(`${environment.backendUrl}/heroe/` + game);
	}
}
