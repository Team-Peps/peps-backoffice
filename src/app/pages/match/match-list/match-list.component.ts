import {Component, OnInit} from '@angular/core';
import {MatchService} from '../../../service/match.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatchListItemResponse} from '../../../model/match/match';
import {AsyncPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-match-list',
	imports: [
		AsyncPipe,
		DatePipe
	],
  templateUrl: './match-list.component.html',
})
export class MatchListComponent implements OnInit {

	constructor(
		private readonly matchService: MatchService,
	) {}

	private matchsSubject = new BehaviorSubject<MatchListItemResponse[]>([]);
	matchs$: Observable<MatchListItemResponse[]> = this.matchsSubject.asObservable();

	ngOnInit(): void {
		this.loadMatchs()
    }

	loadMatchs() {
		this.matchService.getAllMatches().subscribe(matchs => {
			this.matchsSubject.next(matchs);
		});
	}

	wantDeleteMatch(match: MatchListItemResponse) {

	}

	wantEditMatch(match: MatchListItemResponse) {

	}
}
