import {ChangeDetectorRef, Component} from '@angular/core';
import {AsyncPipe, TitleCasePipe} from '@angular/common';
import {ReplacePipe} from '../../../core/utils/replacePipe';
import {RosterService} from '../../../service/roster.service';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {Roster} from '../../../model/roster';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../service/toast.service';
import {ModalComponent} from '../../../core/components/modal/modal.component';
import {RouterLink} from '@angular/router';
import {UpdateRosterComponent} from '../update-roster/update-roster.component';
import {PaginationService} from '../../../service/pagination.service';

@Component({
  selector: 'app-roster-list',
	imports: [
		AsyncPipe,
		ReplacePipe,
		TitleCasePipe,
		ReactiveFormsModule,
		ModalComponent,
		RouterLink,
		UpdateRosterComponent,
	],
  templateUrl: './roster-list.component.html',
})
export class RosterListComponent {

	constructor(
		private readonly rosterService: RosterService,
		private readonly toastService: ToastService,
		private readonly paginationService: PaginationService,
	) {
		this.loadRosters();
	}

	private rostersPepsSubject = new BehaviorSubject<Roster[]>([]);
	rostersPeps$: Observable<Roster[]> = this.rostersPepsSubject.asObservable();

	private rostersOpponentSubject = new BehaviorSubject<Roster[]>([]);
	rostersOpponent$: Observable<Roster[]> = this.rostersOpponentSubject.asObservable();
	displayedOpponentRosters: Roster[] = [];

	isAddRoster: boolean = false;
	isWantDeleteRoster: boolean = false;

	selectedRoster: Roster | null = null;
	rosterToDelete: Roster | null = null;

	itemsPerPage: number = 5;
	currentPage: number = 1;
	totalPages: number = 1;
	totalItems = 0;

	paginatedRosters$: Observable<Roster[]> = this.rostersOpponent$.pipe(
		map(rosters => {
			return this.paginationService.paginate(
				rosters,
				this.currentPage,
				this.itemsPerPage
			);
		})
	);

	pepsRosterCounter: number = 0;

	loadRosters(): void {
		this.rosterService.getOpponentRosters().subscribe(rosters => {
			this.displayedOpponentRosters = rosters;
			this.totalItems = rosters.length;
			this.totalPages = this.paginationService.getTotalPages(this.totalItems, this.itemsPerPage);
			this.rostersOpponentSubject.next(rosters);
		});
		this.rosterService.getPepsRosters().subscribe(rosters => {
			this.rostersPepsSubject.next(rosters);
			this.pepsRosterCounter = rosters.length;
		})
	}

	wantAddRoster(): void {
		this.isAddRoster = !this.isAddRoster;
	}

	handleCancelAddOrEditRoster() {
		this.isAddRoster = false;
		this.selectedRoster = null;
	}

	wantEditRoster(roster: Roster): void {
		this.isAddRoster = false;
		this.selectedRoster = roster;
	}

	wantDeleteRoster(roster: Roster): void {
		this.isWantDeleteRoster = !this.isWantDeleteRoster;
		this.rosterToDelete = roster;
	}

	cancelDeleteRoster() {
		this.rosterToDelete = null;
	}

	deleteRoster() {
		this.rosterService.deleteRoster(this.rosterToDelete!).subscribe({
			next: () => {
				this.toastService.show('Equipe adverse supprimé avec succès', 'success');
				this.rostersOpponentSubject.next(this.rostersOpponentSubject.value.filter(roster => roster !== this.rosterToDelete));
				this.rosterToDelete = null;
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
				this.rosterToDelete = null;
			}
		})
	}

	handleRosterListUpdated() {
		this.loadRosters();
	}

	nextPage() {
		this.goToPage(this.currentPage + 1);
	}

	previousPage() {
		this.goToPage(this.currentPage - 1);
	}


	goToPage(page: number) {
		if (page >= 1 && page <= this.totalPages) {
			this.currentPage = page;
			this.rostersOpponentSubject.next(this.displayedOpponentRosters);
		}
	}

	changePageSize(event:Event): void {
		const target = event.target as HTMLSelectElement;
		const size = target.value;
		this.itemsPerPage = parseInt(size.toString(), 10);
		this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
		this.currentPage = 1;
		this.rostersOpponentSubject.next(this.displayedOpponentRosters);
	}
}
