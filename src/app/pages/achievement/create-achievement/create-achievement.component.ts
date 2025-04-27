import {Component, Input} from '@angular/core';
import {ToastService} from '@/app/service/toast.service';
import {AchievementService} from '@/app/service/achievement.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {enumKeysObject} from '@/app/core/utils/enum';
import {Game} from '@/app/model/game';
import {Member} from '@/app/model/member/member';

@Component({
	selector: 'app-create-achievement',
	imports: [
		FormsModule,
		ReactiveFormsModule
	],
	templateUrl: './create-achievement.component.html',
})
export class CreateAchievementComponent {

	constructor(
		private readonly toastService: ToastService,
		private readonly achievementService: AchievementService,
	) {}

	achievementForm: FormGroup = new FormGroup({
		competitionName: new FormControl('', [Validators.required]),
		ranking: new FormControl('', Validators.required),
		game: new FormControl(''),
		member: new FormControl(''),
	});

	protected readonly enumKeysObject = enumKeysObject;
	protected readonly Game = Game;

	@Input() members: Member[] = [];
	@Input() typeOfAchievement: 'game' | 'member' = 'game';

	save() {
		const game = this.achievementForm.get('game')?.value;
		const member = this.achievementForm.get('member')?.value;
		if(this.achievementForm.invalid || ['game_placeholder', 'placeholder'].includes(game) || ['member_placeholder', 'placeholder'].includes(member)) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		if(game) {
			const saveData = { ...this.achievementForm.value };
			delete saveData.member;
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
		} else {
			const saveData = { ...this.achievementForm.value };
			const member = saveData.member;
			delete saveData.member;
			delete saveData.game;
			this.achievementService.createMemberAchievement(saveData, member).subscribe({
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

	}
}
