import {Component, OnInit} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {GameMap} from '../../../model/map';
import {MapService} from '../../../service/map.service';
import {Heroe} from '../../../model/heroe';
import {HeroeService} from '../../../service/heroe.service';
import {environment} from '../../../../environment/environment';
import {Game} from '../../../model/game';

@Component({
  selector: 'app-data-marvel-rivals',
	imports: [
		AsyncPipe,
	],
  templateUrl: './data-marvel-rivals.component.html',
  styleUrl: './data-marvel-rivals.component.ts'
})
export class DataMarvelRivalsComponent implements OnInit {

	constructor(
		private readonly mapService: MapService,
		private readonly heroService: HeroeService
	) {}

	ngOnInit(): void {
		this.loadMaps();
		this.loadHeroes();
    }

	private mapsMarverlRivalsSubjet = new BehaviorSubject<GameMap[]>([]);
	mapMarvelRivals$ = this.mapsMarverlRivalsSubjet.asObservable();

	private heroesMarvelRivalsSubjet = new BehaviorSubject<Heroe[]>([]);
	heroesMarvelRivals$ = this.heroesMarvelRivalsSubjet.asObservable();

	minioBaseUrl = environment.minioBaseUrl;

	loadMaps() {
		this.mapService.getAllMapsOfGame(Game.MarvelRivals).subscribe(maps => {
			this.mapsMarverlRivalsSubjet.next(maps);
		})
	}

	loadHeroes() {
		this.heroService.getAllHeroesOfGame(Game.MarvelRivals).subscribe(heroes => {
			this.heroesMarvelRivalsSubjet.next(heroes);
		})
	}

	wantEditMap(id: string) {
	}

	wantEditHeroe(id: string) {

	}
}
