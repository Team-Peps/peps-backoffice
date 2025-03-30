import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environment/environment';
import {GameMap} from '../model/map';
import {Game} from '../model/game';

@Injectable({
	providedIn: 'root'
})
export class MapService {

	constructor(
		private http: HttpClient
	) {}

	getAllMapsOfGame(game: Game): Observable<GameMap[]> {
		return this.http.get<GameMap[]>(`${environment.backendUrl}/map/` + game);
	}

}
