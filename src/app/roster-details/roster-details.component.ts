import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {Roster} from '../model/roster';
import {AsyncPipe} from '@angular/common';
import {RosterService} from '../service/roster.service';

@Component({
  selector: 'app-roster-details',
	imports: [
		AsyncPipe,
		RouterLink,
	],
  templateUrl: './roster-details.component.html',
})
export class RosterDetailsComponent implements OnInit{

	constructor(
		private route: ActivatedRoute,
		private readonly rosterService: RosterService,
	) {}


	private rosterSubject = new BehaviorSubject<Roster|null>(null);
	roster$: Observable<Roster|null> = this.rosterSubject.asObservable();



	ngOnInit() {
		this.route.params.subscribe(params => {
			this.loadRoster(params['id']);
		});
	}

	loadRoster(id: string): void {
		this.rosterService.getRoster(id).subscribe(roster => {
			this.rosterSubject.next(roster);
		});
	}

}
