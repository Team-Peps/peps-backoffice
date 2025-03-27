import {Component, Input} from '@angular/core';
import {
	FormArray,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators
} from '@angular/forms';
import {MatchService} from '../../../../../service/match.service';
import {StepComponent} from './step/step.component';
import {AsyncPipe, NgClass, TitleCasePipe} from '@angular/common';
import {RosterTiny} from '../../../../../model/roster';
import {ReplacePipe} from '../../../../../core/utils/replacePipe';
import {enumKeysObject} from '../../../../../core/utils/enum';
import {MatchType} from '../../../../../model/match/matchType';
import {MemberService} from '../../../../../service/member.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {MemberTiny} from '../../../../../model/member/member';
import {range} from '../../../../../core/utils/range';
import {ToastService} from '../../../../../service/toast.service';
import {MatchFinishedDto} from '../../../../../model/match/match';
import {Router} from '@angular/router';
import {dateInPastValidator} from '../../../../../core/utils/validators';
import {GameMap} from '../../../../../model/map';
import {Heroe} from '../../../../../model/heroe';
import {HeroeService} from '../../../../../service/heroe.service';
import {MapService} from '../../../../../service/map.service';
import {Game} from '../../../../../model/game';

@Component({
  selector: 'app-create-finished-match',
	imports: [
		ReactiveFormsModule,
		StepComponent,
		ReplacePipe,
		TitleCasePipe,
		NgClass,
		AsyncPipe
	],
  templateUrl: './create-finished-match.component.html',
})
export class CreateFinishedMatchComponent {

	constructor(
		private readonly matchService: MatchService,
		private readonly memberService: MemberService,
		private readonly toastService: ToastService,
		private readonly heroeService: HeroeService,
		private readonly mapService: MapService,
		private readonly router: Router
	) {}

	protected readonly enumKeysObject = enumKeysObject;
	protected readonly MatchType = MatchType;
	protected readonly range = range;

	private mapsSubjet = new BehaviorSubject<GameMap[]>([]);
	maps$ = this.mapsSubjet.asObservable();

	private heroesSubjet = new BehaviorSubject<Heroe[]>([]);
	heroes$ = this.heroesSubjet.asObservable();


	@Input() pepsRoster: RosterTiny[] | null | undefined;
	@Input() opponentRoster: RosterTiny[] | null | undefined;

	matchFormStep1 = new FormGroup({

		//Step 1
		datetime: new FormControl('', [Validators.required, dateInPastValidator()]),
		competitionName: new FormControl('', Validators.required),
		type: new FormControl('', Validators.required),
		roster: new FormControl('', Validators.required),
		opponentRoster: new FormControl('', Validators.required),
		game: new FormControl('no-choice', {validators: Validators.required, nonNullable: true}),

	});

	matchFormStep2 = new FormGroup({
		//Step 2
		score: new FormControl(0, Validators.required),
		opponentScore: new FormControl(0, Validators.required),
		pepsPlayers: new FormControl([], Validators.required),
		opponentPlayers: new FormControl([], Validators.required),

	})

	matchFormStep3 = new FormGroup({
		//Step 3
		rounds: new FormArray<FormGroup>([])

	})

	step: number = 1;
	totalMap: number = 0;

	isButtonDisabled: boolean = false;

	pepsRosterSorted: RosterTiny[] = [];
	opponentRosterSorted: RosterTiny[] = [];

	private membersPepsSubject = new BehaviorSubject<MemberTiny[]>([]);
	membersPeps$: Observable<MemberTiny[]> = this.membersPepsSubject.asObservable();

	private membersOpponentSubject = new BehaviorSubject<MemberTiny[]>([]);
	membersOpponent$: Observable<MemberTiny[]> = this.membersOpponentSubject.asObservable();


	previousStep() {
		if(this.step === 1) {
			return;
		}
		this.step = this.step - 1;
	}

	nextStep() {
		if(this.step === 3) {
			return;
		}
		this.step = this.step + 1;
	}

	blockComma(event: KeyboardEvent) {
		if(event.key === ',' || event.key === '.') {
			event.preventDefault();
		}
	}

	changeGame(event: Event): void {
		const select = event.target as HTMLSelectElement;
		const selectedGame = select.value;

		if (!selectedGame || !this.pepsRoster || !this.opponentRoster) return;

		this.pepsRosterSorted = this.pepsRoster.filter(pep => pep.game === selectedGame);
		this.opponentRosterSorted = this.opponentRoster.filter(opp => opp.game === selectedGame);
		this.mapService.getAllMapsOfGame(selectedGame).subscribe(maps => {
			this.mapsSubjet.next(maps);
		})
		this.heroeService.getAllHeroesOfGame(selectedGame).subscribe(heroes => {
			this.heroesSubjet.next(heroes);
		});
	}

	changeTeam($event: Event, roster: string) {
		const select = $event.target as HTMLSelectElement;
		const selectedRoster = select.value;

		if (roster === 'peps') {
			this.memberService.getMemberByRosterId(selectedRoster).subscribe({
				next: members => this.membersPepsSubject.next(members)
			})
		} else {
			this.memberService.getMemberByRosterId(selectedRoster).subscribe({
				next: members => this.membersOpponentSubject.next(members)
			})
		}
	}

	gotoStepThree() {
		this.nextStep();
		this.totalMap = this.matchFormStep2.value.score! + this.matchFormStep2.value.opponentScore!;
		for (let i=0; i < this.totalMap; i++) {
			(this.matchFormStep3.get('rounds') as FormArray).push(this.createRoundForm(i+1));
		}
	}

	createRoundForm(round: number): FormGroup {
		return new FormGroup({
			bannedHeroPeps: new FormControl('nohero', Validators.required),
			scorePeps: new FormControl([Validators.required, Validators.min(0)]),
			mapId: new FormControl('nomap', Validators.required),
			scoreOpponent: new FormControl([Validators.required, Validators.min(0)]),
			bannedHeroOpponent: new FormControl('nohero', Validators.required),
			gameCode: new FormControl('', Validators.required),
			round: new FormControl(round),
		});
	}

	get rounds(): FormArray<FormGroup> {
		return this.matchFormStep3.get('rounds') as FormArray<FormGroup>;
	}

	saveFinishedMatch() {

		if(this.matchFormStep1.invalid || this.matchFormStep2.invalid || this.matchFormStep3.invalid) {
			this.toastService.show('Veuillez remplir tous les champs !', 'error');
			return;
		}

		const matchDto: MatchFinishedDto = {
			datetime: this.matchFormStep1.value.datetime!,
			competitionName: this.matchFormStep1.value.competitionName!,
			type: this.matchFormStep1.value.type!,
			roster: this.matchFormStep1.value.roster!,
			opponentRoster: this.matchFormStep1.value.opponentRoster!,
			game: this.matchFormStep1.value.game!,
			score: this.matchFormStep2.value.score!,
			opponentScore: this.matchFormStep2.value.opponentScore!,
			pepsPlayers: this.matchFormStep2.value.pepsPlayers!,
			opponentPlayers: this.matchFormStep2.value.opponentPlayers!,
			rounds: this.matchFormStep3.value.rounds!
		}
		this.isButtonDisabled = true;

		this.matchService.createFinishedMatch(matchDto).subscribe({
			next: () => {
				this.toastService.show('Match créé avec succès !', 'success');
				this.matchFormStep1.reset();
				this.matchFormStep1.markAsPristine();
				this.matchFormStep2.reset();
				this.matchFormStep2.markAsPristine();
				this.matchFormStep3.reset();
				this.matchFormStep3.markAsPristine();
				this.isButtonDisabled = false;
				this.step = 999;
			},
			error: (error) => {
				this.toastService.show(error, 'error');
				this.isButtonDisabled = false;
			}
		});

	}

	createAnotherMatch() {
		this.matchFormStep1.reset();
		this.matchFormStep1.markAsPristine();
		this.matchFormStep2.reset();
		this.matchFormStep2.markAsPristine();
		this.matchFormStep3.reset();
		this.matchFormStep3.markAsPristine();
		this.step = 1;
		this.totalMap = 0;
		this.isButtonDisabled = false;
	}

	goToMatchList() {
		this.router.navigate(['management/matches']);
	}

}
