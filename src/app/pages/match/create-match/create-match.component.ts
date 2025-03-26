import {Component, HostListener, OnInit} from '@angular/core';
import {CreateFinishedMatchComponent} from './components/create-finished-match/create-finished-match.component';
import {CreateUpcomingMatchComponent} from './components/create-upcoming-match/create-upcoming-match.component';
import {BehaviorSubject} from 'rxjs';
import {RosterTiny} from '../../../model/roster';
import {RosterService} from '../../../service/roster.service';
import {AsyncPipe, NgClass, NgStyle} from '@angular/common';

@Component({
  selector: 'app-create-match',
	imports: [
		CreateFinishedMatchComponent,
		CreateUpcomingMatchComponent,
		NgClass,
		NgStyle,
		AsyncPipe
	],
  templateUrl: './create-match.component.html',
})
export class CreateMatchComponent implements OnInit {

	constructor(
		private readonly rosterService: RosterService
	) { }

	addingChoiceMatch: string = "upcoming";
	isMobile: boolean = false;

	private pepsRostersSubjet = new BehaviorSubject<RosterTiny[]>([]);
	pepsRosters$ = this.pepsRostersSubjet.asObservable();

	private opponentRostersSubjet = new BehaviorSubject<RosterTiny[]>([]);
	opponentRosters$ = this.opponentRostersSubjet.asObservable();

	ngOnInit() {
		this.loadRosters();
		this.onResize();
	}

	loadRosters(): void {
		this.rosterService.getPepsRostersTiny().subscribe(rosters => {
			this.pepsRostersSubjet.next(rosters);
		});
		this.rosterService.getOpponentRostersTiny().subscribe(rosters => {
			this.opponentRostersSubjet.next(rosters);
		})
	}

	@HostListener('window:resize')
	onResize() {
		this.isMobile = window.innerWidth <= 768;
	}

	wantAddFinishedMatch() {
		this.addingChoiceMatch = "finished";
	}

	wantAddUpcomingMatch() {
		this.addingChoiceMatch = "upcoming";
	}
}
