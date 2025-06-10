import {Component, OnInit} from '@angular/core';
import {MatchService} from '../../../service/match.service';
import {DatePipe, NgClass} from '@angular/common';
import {Match} from '../../../model/match';
import {environment} from '@/environments/environment';
import {demandCommandFailureMessage} from '@angular/cli/src/command-builder/utilities/command';

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
	isLoading: boolean = false;
	isShowProgress: boolean = false;
	messages: string[] = [];
	receivedMessages = false;

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

	updateMatches() {
		this.messages = [];
		this.isLoading = true;
		this.isShowProgress = true;
		this.matchService.updateAndSaveMatches().subscribe({
			next: (msg) => {
				this.messages.push(msg)
				this.receivedMessages = true;
			},
			error: (err) => {
				if (!this.receivedMessages) {
					this.messages.push('Erreur bloquante : ' + err);
					this.isLoading = false;
				} else {
					this.messages.push('Mise à jours des matchs terminés avec des erreurs non bloquantes');
					this.isLoading = false;
				}
			},
			complete: () => {
				this.messages.push('Mise à jour des matchs terminée');
				this.isLoading = false;
				this.loadMatches();
			}
		})
	}
}
