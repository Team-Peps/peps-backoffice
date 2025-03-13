import {ChangeDetectorRef, Component} from '@angular/core';
import {AsyncPipe, NgClass, TitleCasePipe} from '@angular/common';
import {ReplacePipe} from '../../../core/utils/replacePipe';
import {RosterService} from '../../../service/roster.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Roster} from '../../../model/roster';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '../../../service/toast.service';
import {ModalComponent} from '../../../core/components/modal/modal.component';

@Component({
  selector: 'app-roster-list-opponent',
	imports: [
		AsyncPipe,
		ReplacePipe,
		TitleCasePipe,
		ReactiveFormsModule,
		NgClass,
		ModalComponent
	],
  templateUrl: './roster-list-opponent.component.html',
})
export class RosterListOpponentComponent {

	constructor(
		private readonly rosterService: RosterService,
		private readonly toastService: ToastService,
		private readonly cdr: ChangeDetectorRef
	) {
		this.loadRosters();
	}

	opponentRosterForm: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		game: new FormControl('overwatch', Validators.required),
	});

	private rostersSubject = new BehaviorSubject<Roster[]>([]);
	rosters$: Observable<Roster[]> = this.rostersSubject.asObservable();

	rosterToDelete: Roster | null = null;
	rosterToEdit: Roster | null = null;

	isAddOpponentRoster: boolean = false;
	isButtonDisabled: boolean = false;
	isWantDeleteRoster: boolean = false;
	isEditOpponentRoster: boolean = false;

	loadRosters(): void {
		this.rosterService.getOpponentRosters().subscribe(rosters => {
			this.rostersSubject.next(rosters);
		});
	}

	wantAddOpponentRoster(): void {
		this.isAddOpponentRoster = !this.isAddOpponentRoster;
	}

	cancelAddOrEditOpponentRoster() {
		this.isAddOpponentRoster = false;
		this.isEditOpponentRoster = false;
		this.rosterToEdit = null;
	}

	wantEditOpponentRoster(roster: Roster): void {
		this.isEditOpponentRoster = !this.isEditOpponentRoster;
		this.isAddOpponentRoster = false;
		this.rosterToEdit = roster;
		this.opponentRosterForm.patchValue(roster);
	}

	createOpponentRoster() {
		if (this.opponentRosterForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		this.isButtonDisabled = true;

		this.rosterService.createOpponentRoster(this.opponentRosterForm.value).subscribe({
			next: (roster) => {
				this.rostersSubject.next([...this.rostersSubject.value, roster]);
				this.toastService.show('Equipe adverse créé avec succès', 'success');
				this.opponentRosterForm.get('name')!.setValue('');
				this.opponentRosterForm.markAsPristine();
				this.isButtonDisabled = false;

			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
				this.isButtonDisabled = false;
			}
		});
	}

	wantDeleteRoster(roster: Roster): void {
		this.isWantDeleteRoster = !this.isWantDeleteRoster;
		this.rosterToDelete = roster;
	}

	cancelDeleteRoster() {
		this.rosterToDelete = null;
	}

	deleteRoster() {
		this.rosterService.deleteOpponentRoster(this.rosterToDelete!).subscribe({
			next: () => {
				this.toastService.show('Equipe adverse supprimé avec succès', 'success');
				this.rostersSubject.next(this.rostersSubject.value.filter(roster => roster !== this.rosterToDelete));
				this.rosterToDelete = null;
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
				this.rosterToDelete = null;
			}
		})
	}

	updateOpponentRoster() {
		if (this.opponentRosterForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		this.isButtonDisabled = true;

		const updatedRoster = { ...this.rosterToEdit, ...this.opponentRosterForm.value };

		this.rosterService.updateOpponentRoster(updatedRoster).subscribe({
			next: (roster) => {
				const updatedRosters = this.rostersSubject.value.map(r => r.id === roster.id ? roster : r);
				this.rostersSubject.next(updatedRosters);
				this.toastService.show('Equipe adverse mise à jour avec succès', 'success');
				this.isEditOpponentRoster = false;
				this.rosterToEdit = null;
				this.isButtonDisabled = false;
				this.opponentRosterForm.get('name')!.setValue('');
				this.opponentRosterForm.markAsPristine();
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
				this.isButtonDisabled = false;
			}
		});
	}

}
