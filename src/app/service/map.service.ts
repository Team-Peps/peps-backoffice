import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environment/environment';
import {GameMap} from '../model/map';

@Injectable({
	providedIn: 'root'
})
export class MapService {

	constructor(
		private http: HttpClient
	) {}

	getAllMapsOfGame(game: string): Observable<GameMap[]> {
		return this.http.get<GameMap[]>(`${environment.backendUrl}/map/` + game);
	}

}
