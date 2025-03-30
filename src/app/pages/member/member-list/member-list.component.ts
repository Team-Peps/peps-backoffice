import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MemberService} from '../../../service/member.service';
import {Member} from '../../../model/member/member';
import {environment} from "../../../../environment/environment";
import {MemberTableComponent} from './memberTable/memberTable.component';
import {UpdateMemberComponent} from '../update-member/update-member.component';
import {ToastService} from '../../../service/toast.service';
import {Router} from '@angular/router';
import {Game} from '../../../model/game';
import {ReactiveFormsModule} from '@angular/forms';
import {enumKeysObject} from '../../../core/utils/enum';
import {MemberRole} from '../../../model/member/memberRole';

@Component({
  selector: 'app-member-list',
	imports: [
		MemberTableComponent,
		UpdateMemberComponent,
		ReactiveFormsModule,
	],
  templateUrl: './member-list.component.html',
})
export class MemberListComponent implements OnInit {

	constructor(
	  private readonly memberService: MemberService,
	  private cdr: ChangeDetectorRef,
	  private readonly toastService: ToastService,
	  private readonly router: Router
	) {}
	protected readonly environment = environment;

	members: Member[] = [];
	substitutes: Member[] = [];
	coaches: Member[] = [];
	selectedMember: Member | null = null;
	isCreateMember: boolean = false;
	countMembers: number = 0;
	selectedGame: Game = Game.OVERWATCH;

	ngOnInit() {
		this.loadMembers();
	}

	loadMembers(): void {
		this.memberService.getMembers(this.selectedGame).subscribe(response => {
			this.members = response['members'];
			this.substitutes = response['substitutes'];
			this.coaches = response['coaches'];
			this.countMembers = this.members.length;
			this.cdr.detectChanges();
		});
	}

	changeGame($event: Event) {
		const target = $event.target as HTMLSelectElement;
		const value = target.value;
		this.selectedGame = value as Game;
		this.loadMembers();
	}

	selectMember(member: Member) {
		this.selectedMember = member;
		this.isCreateMember = false;
		this.cdr.detectChanges();
		document.getElementById('updateMember')?.scrollIntoView({behavior: 'smooth'});
	}

	toggleCreateMember() {
		this.isCreateMember = !this.isCreateMember;
		this.selectedMember = null;
		this.cdr.detectChanges();
	}

	setSubstitute($event: Member) {
		this.memberService.setSubstitute($event.id).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.loadMembers();
			},
			error: (error) => {
				console.error('Error setting member active:', error);
				this.toastService.show('Erreur lors de la mise à jour du membre', 'error');
			}
		})
	}

	setActive($event: Member) {
		this.memberService.setActive($event.id).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.loadMembers();
			},
			error: (error) => {
				console.error('Error setting member active:', error);
				this.toastService.show('Erreur lors de la mise à jour du membre', 'error');
			}
		})
	}

	removeMember($event: Member) {
		this.memberService.deleteMember($event.id).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.loadMembers();
			},
			error: (error) => {
				console.error('Error deleting member:', error);
				this.toastService.show('Erreur lors de la suppression du membre', 'error');

			}
		})
	}

	protected readonly enumKeysObject = enumKeysObject;
	protected readonly Game = Game;
}
