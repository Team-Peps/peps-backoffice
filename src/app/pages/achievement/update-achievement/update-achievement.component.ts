import {ChangeDetectorRef, Component, Input, OnChanges} from '@angular/core';
import {ToastService} from '@/app/service/toast.service';
import {AchievementService} from '@/app/service/achievement.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {enumKeysObject} from '@/app/core/utils/enum';
import {Game} from '@/app/model/game';
import {NgClass} from '@angular/common';
import {Achievement} from '@/app/model/achievement';

@Component({
	selector: 'app-update-achievement',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		NgClass
	],
	templateUrl: './update-achievement.component.html',
})
export class UpdateAchievementComponent implements OnChanges {

	constructor(
		private readonly toastService: ToastService,
		private readonly achievementService: AchievementService,
		private readonly cdr: ChangeDetectorRef,
	) {}

	achievementForm: FormGroup = new FormGroup({
		competitionName: new FormControl('', [Validators.required]),
		ranking: new FormControl('', Validators.required),
		game: new FormControl(''),
		year: new FormControl('', [Validators.required, Validators.min(2000), Validators.max(new Date().getFullYear())]),
	});

	isRosterValid: boolean = false;
	@Input() achievement: Achievement | null = null;

	protected readonly enumKeysObject = enumKeysObject;
	protected readonly Game = Game;

	ngOnChanges() {
		this.initForm();
	}

	initForm() {
		if (this.achievement) {
			this.achievementForm.patchValue({
				competitionName: this.achievement.competitionName,
				ranking: this.achievement.ranking,
				game: this.achievement.game,
				year: this.achievement.year,
			});
			this.isRosterValid = [Game.OVERWATCH, Game.MARVEL_RIVALS].includes(this.achievement.game);
		} else {
			this.achievementForm.reset();
			this.isRosterValid = false;
		}
		this.cdr.detectChanges();
	}

	saveOrUpdateAchievement() {
		if (this.achievementForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		if(this.achievement) {
			this.update();
		} else {
			this.save();
		}
	}

	save() {
		const game = this.achievementForm.get('game')?.value;
		if(this.achievementForm.invalid || !game) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		const saveData = { ...this.achievementForm.value };
		this.achievementService.createGameAchievement(saveData).subscribe({
			next: (response) => {
				this.achievementForm.reset();
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});

	}

	update() {

		const { competitionName, ranking, game, year } = this.achievementForm.value;

		const achievement: Achievement = {
			id: this.achievement!.id,
			competitionName: competitionName,
			ranking: ranking,
			game: game as Game,
			year: year as number,
		};

		this.achievementService.updateGameAchievement(achievement).subscribe({
			next: (response) => {
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la mise à jour :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	changeRoster($event: Event) {
		const target = $event.target as HTMLSelectElement;
		const value = target.value;
		this.isRosterValid = [Game.OVERWATCH, Game.MARVEL_RIVALS].includes(value as Game);
	}
}
