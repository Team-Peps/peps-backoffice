import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AchievementService} from '@/app/service/achievement.service';
import {Achievement} from '@/app/model/achievement';
import {Game} from '@/app/model/game';
import {FormsModule} from '@angular/forms';
import {enumKeysObject} from '@/app/core/utils/enum';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {ToastService} from '@/app/service/toast.service';
import {UpdateAchievementComponent} from '../update-achievement/update-achievement.component';

@Component({
  selector: 'app-achievement-list',
	imports: [
		FormsModule,
		NgOptimizedImage,
		NgClass,
		UpdateAchievementComponent
	],
  templateUrl: './achievement-list.component.html',
})
export class AchievementListComponent implements OnInit {

	constructor(
		private readonly achievementService: AchievementService,
		private readonly toastService: ToastService,
		private readonly cdr: ChangeDetectorRef,
	) {}

	protected readonly enumKeysObject = enumKeysObject;
	protected readonly Game = Game;

	selectedGame: Game | null = Game.OVERWATCH;
	achievements: Achievement[] = [];
	isCreateAchievement: boolean = false;
	selectedAchievement: Achievement | null = null;

	ngOnInit(): void {
		this.loadAchievementByGame();
    }

	loadAchievementByGame(): void {
		if (this.selectedGame) {
			this.achievementService.getAllAchievementByGame(this.selectedGame).subscribe({
				next: (data) => this.achievements = data.sort((a, b) => a.ranking - b.ranking),
				error: (err) => console.error(err)
			});
		}
	}

	changeSelection($event: Event) {
		const target = $event.target as HTMLSelectElement;
		const value = target.value;
		if([Game.OVERWATCH, Game.MARVEL_RIVALS].includes(value as Game)) {
			this.selectedGame = value as Game;
			this.loadAchievementByGame();
		} else {
			this.selectedGame = null;
		}
	}

	deleteAchievement(achievementId: string): void {
		this.achievementService.deleteAchievement(achievementId).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.loadAchievementByGame();
			},
			error: (err) => console.error(err)
		});
	}

	toggleCreateAchievement() {
		this.isCreateAchievement = !this.isCreateAchievement;
	}

	cancelCreateAchievement() {
		this.isCreateAchievement = false;
	}

	updateAchievement(achievement: Achievement) {
		this.selectedAchievement = achievement;
		this.isCreateAchievement = false;
		document.getElementById('updateAchievement')?.scrollIntoView({behavior: 'smooth'});
		this.cdr.detectChanges();
	}
}
