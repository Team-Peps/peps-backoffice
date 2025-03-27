import {Component, OnInit} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {GameMap} from '../../../model/map';
import {MapService} from '../../../service/map.service';
import {environment} from '../../../../environment/environment';
import {Heroe} from '../../../model/heroe';
import {HeroeService} from '../../../service/heroe.service';
import {Game} from '../../../model/game';

@Component({
  selector: 'app-data-overwatch',
	imports: [
		AsyncPipe,
	],
  templateUrl: './data-overwatch.component.html',
  styleUrl: './data-overwatch.component.css'
})
export class DataOverwatchComponent implements OnInit {

	constructor(
		private readonly mapService: MapService,
		private readonly heroService: HeroeService
	) {}

	ngOnInit(): void {
		this.loadMaps();
		this.loadHeroes();
    }

	private mapsOverwatchSubjet = new BehaviorSubject<GameMap[]>([]);
	mapsOverwatch$ = this.mapsOverwatchSubjet.asObservable();

	private heroesOverwatchSubjet = new BehaviorSubject<Heroe[]>([]);
	heroesOverwatch$ = this.heroesOverwatchSubjet.asObservable();

	minioBaseUrl = environment.minioBaseUrl;

	loadMaps() {
		this.mapService.getAllMapsOfGame(Game.Overwatch).subscribe(maps => {
			this.mapsOverwatchSubjet.next(maps);
		})
	}

	loadHeroes() {
		this.heroService.getAllHeroesOfGame(Game.Overwatch).subscribe(heroes => {
			this.heroesOverwatchSubjet.next(heroes);
		})
	}

	wantEditMap(id: string) {
	}

	wantEditHeroe(id: string) {

	}
}
