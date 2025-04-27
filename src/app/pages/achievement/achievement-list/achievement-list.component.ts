import {Component, OnInit} from '@angular/core';
import {AchievementService} from '@/app/service/achievement.service';
import {Achievement} from '@/app/model/achievement';
import {Game} from '@/app/model/game';
import {MemberService} from '@/app/service/member.service';
import {Member} from '@/app/model/member/member';
import {FormsModule} from '@angular/forms';
import {enumKeysObject} from '@/app/core/utils/enum';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {ToastService} from '@/app/service/toast.service';
import {CreateAchievementComponent} from '../create-achievement/create-achievement.component';

@Component({
  selector: 'app-achievement-list',
	imports: [
		FormsModule,
		NgOptimizedImage,
		NgClass,
		CreateAchievementComponent
	],
  templateUrl: './achievement-list.component.html',
})
export class AchievementListComponent implements OnInit {

	constructor(
		private readonly achievementService: AchievementService,
		private readonly memberService: MemberService,
		private readonly toastService: ToastService,
	) {}

	protected readonly enumKeysObject = enumKeysObject;
	protected readonly Game = Game;

	selectedGame: Game | null = null;
	selectedMemberId: string | null = null;

	achievements: Achievement[] = [];
	members: Member[] = [];

	isCreateAchievement: boolean = false;
	typeOfAchievement: 'game' | 'member' = 'game';

	ngOnInit(): void {
		this.loadMembers();
    }

	loadMembers() {
		this.memberService.getMembers(Game.OVERWATCH).subscribe({
			next: (members) => {
				this.members = [...this.members, ...members['substitutes'], ...members['coaches'], ...members['members']];
			},
			error: (err) => console.error(err)
		});
		this.memberService.getMembers(Game.MARVEL_RIVALS).subscribe({
			next: (members) => {
				this.members = [...this.members, ...members['substitutes'], ...members['coaches'], ...members['members']];
			},
			error: (err) => console.error(err)
		});
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
		if(['member_placeholder', 'game_placeholder', 'placeholder'].includes(value)) {
			return;
		}
		if([Game.OVERWATCH, Game.MARVEL_RIVALS].includes(value as Game)) {
			this.selectedGame = value as Game;
			this.selectedMemberId = null;
			this.loadAchievementByGame();
		} else {
			this.selectedMemberId = value;
			this.selectedGame = null;
			this.loadAchievementByMember();
		}
	}

	loadAchievementByMember(): void {
		if (this.selectedMemberId) {
			this.achievementService.getAllAchievementByMember(this.selectedMemberId).subscribe({
				next: (data) => this.achievements = data.sort((a, b) => a.ranking - b.ranking),
				error: (err) => console.error(err)
			});
		}
	}

	deleteAchievement(achievementId: string): void {
		this.achievementService.deleteAchievement(achievementId).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				if(this.selectedGame) {
					this.loadAchievementByGame();
				} else if(this.selectedMemberId) {
					this.loadAchievementByMember();
				}
			},
			error: (err) => console.error(err)
		});
	}

	toggleCreateAchievement(type: 'game' | 'member') {
		this.isCreateAchievement = !this.isCreateAchievement;
		this.typeOfAchievement = type;
	}

	cancelCreateAchievement() {
		this.isCreateAchievement = false;
	}

}
