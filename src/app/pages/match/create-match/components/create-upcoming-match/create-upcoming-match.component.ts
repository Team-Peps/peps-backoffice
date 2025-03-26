import {Component, Input, OnInit} from '@angular/core';
import {TitleCasePipe} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ReplacePipe} from '../../../../../core/utils/replacePipe';
import {MatchType} from '../../../../../model/match/matchType';
import {enumKeysObject} from '../../../../../core/utils/enum';
import {RosterTiny} from '../../../../../model/roster';
import {ToastService} from '../../../../../service/toast.service';
import {MatchService} from '../../../../../service/match.service';
import {MatchFormUpcoming} from '../../../../../model/match/match';

@Component({
  selector: 'app-create-upcoming-match',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ReplacePipe,
		TitleCasePipe,
	],
  templateUrl: './create-upcoming-match.component.html',
})
export class CreateUpcomingMatchComponent implements OnInit {

	constructor(
		private readonly toastService: ToastService,
		private readonly matchService: MatchService,
	) { }

	protected readonly MatchType = MatchType;
	protected readonly enumKeysObject = enumKeysObject;

	@Input() pepsRoster: RosterTiny[] | null | undefined;
	@Input() opponentRoster: RosterTiny[] | null | undefined;

	matchForm = new FormGroup({
		date: new FormControl('', { validators: Validators.required, nonNullable: true }),
		competitionName: new FormControl('', { validators: Validators.required, nonNullable: true }),
		type: new FormControl('', { validators: Validators.required, nonNullable: true }),
		roster: new FormControl('', { validators: Validators.required, nonNullable: true }),
		opponentRoster: new FormControl('', { validators: Validators.required, nonNullable: true }),
		game: new FormControl('no-choice', { validators: Validators.required, nonNullable: true }),
	});

	isButtonDisabled: boolean = false;
	pepsRosterSorted: RosterTiny[] = [];
	opponentRosterSorted: RosterTiny[] = [];

	ngOnInit() {
	}

	addMatch() {

		if(this.matchForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs !', 'error');
			return;
		}
		const match: MatchFormUpcoming = this.matchForm.getRawValue();
		this.isButtonDisabled = true;
		delete match.game;

		this.matchService.createUpcomingMatch(match).subscribe({
			next: () => {
				this.toastService.show('Match créé avec succès !', 'success');
				this.matchForm.reset();
				this.matchForm.markAsPristine();
				this.isButtonDisabled = false;
			},
			error: (error) => {
				this.toastService.show(error, 'error');
				this.isButtonDisabled = false;
			}
		});

	}

	changeGame(event: Event): void {
		const select = event.target as HTMLSelectElement;
		const selectedGame = select.value;

		if (!selectedGame || !this.pepsRoster || !this.opponentRoster) return;

		this.pepsRosterSorted = this.pepsRoster.filter(pep => pep.game === selectedGame);
		this.opponentRosterSorted = this.opponentRoster.filter(opp => opp.game === selectedGame);
	}

}
