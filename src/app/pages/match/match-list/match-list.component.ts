import {Component, OnInit} from '@angular/core';
import {MatchService} from '../../../service/match.service';
import {DatePipe, NgClass} from '@angular/common';
import {Match} from '../../../model/match';
import {environment} from '../../../../environment/environment';

@Component({
  selector: 'app-match-list',
	imports: [
		DatePipe,
		NgClass
	],
  templateUrl: './match-list.component.html',
})
export class MatchListComponent implements OnInit {

	constructor(
		private readonly matchService: MatchService
	) {}

	ngOnInit(): void {
		this.loadMatches();
	}

	minioBaseUrl = environment.minioBaseUrl;

	groupedMatches: Record<string, Match[]> = {};
	filteredMatches: Match[] = [];

	selectedGame: string = 'all';

	loadMatches(): void {
		this.matchService.getAllMatches().subscribe((data: Record<string, Match[]>) => {
			this.groupedMatches = data;
			this.updateFilteredMatches();
		});
	}

	updateFilteredMatches(): void {
		if (this.selectedGame === 'all') {
			this.filteredMatches = Object.values(this.groupedMatches).flat();
		} else {
			this.filteredMatches = this.groupedMatches[this.selectedGame] ?? [];
		}
	}

	setSelectedGame(game: string): void {
		this.selectedGame = game;
		this.updateFilteredMatches();
	}

	getGameKeys(): string[] {
		return Object.keys(this.groupedMatches);
	}

	wantEditMatch(matchId: string) {

	}
}
