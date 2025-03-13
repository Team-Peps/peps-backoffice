import { Component } from '@angular/core';
import {RosterService} from '../../../service/roster.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Roster} from '../../../model/roster';
import {ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe, TitleCasePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ReplacePipe} from '../../../core/utils/replacePipe';

@Component({
  selector: 'app-roster-list',
	imports: [
		ReactiveFormsModule,
		AsyncPipe,
		RouterLink,
		TitleCasePipe,
		ReplacePipe
	],
  templateUrl: './roster-list.component.html',
})
export class RosterListComponent {

	constructor(
		private readonly rosterService: RosterService,
	) {
		this.loadRosters();
	}

	private rostersSubject = new BehaviorSubject<Roster[]>([]);
	rosters$: Observable<Roster[]> = this.rostersSubject.asObservable();

	loadRosters(): void {
		this.rosterService.getPepsRosters().subscribe(rosters => {
			this.rostersSubject.next(rosters);
		});
	}

}
