import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {Roster} from '../../../model/roster';
import {AsyncPipe, NgClass, TitleCasePipe} from '@angular/common';
import {RosterService} from '../../../service/roster.service';
import {ReplacePipe} from "../../../core/utils/replacePipe";
import {MemberService} from '../../../service/member.service';
import {ToastService} from '../../../service/toast.service';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Member} from '../../../model/member/member';

@Component({
  selector: 'app-roster-details',
	imports: [
		AsyncPipe,
		ReplacePipe,
		TitleCasePipe,
		FormsModule,
		ReactiveFormsModule,
		NgClass,
	],
  templateUrl: './roster-details.component.html',
})
export class RosterDetailsComponent implements OnInit{

	constructor(
		private route: ActivatedRoute,
		private readonly rosterService: RosterService,
		private readonly memberService: MemberService,
		private readonly toastService: ToastService,
	) {}

	memberId = new FormControl('0', Validators.required);

	private rosterSubject = new BehaviorSubject<Roster|null>(null);
	roster$: Observable<Roster|null> = this.rosterSubject.asObservable();

	private membersSubject = new BehaviorSubject<Member[]>([]);
	members$: Observable<Member[]> = this.membersSubject.asObservable();

	rosterId: string = '';
	isAddMemberToRoster: boolean = false;
	isButtonDisabled: boolean = true;

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.loadRoster(params['id']);
			this.rosterId = params['id'];
		});
	}

	loadRoster(id: string): void {
		this.rosterService.getRoster(id).subscribe(roster => {
			this.rosterSubject.next(roster);
		});
	}

	handleRemoveUserFromRoster(memberId: string): void {
		this.memberService.removeMemberFromRoster(memberId).subscribe({
			next: (response) => {
				console.log('✅', response.message);
				this.toastService.show(response.message, 'success');
				this.loadRoster(this.rosterId);
			},
			error: (error) => {
				console.error('❌', error.message);
				this.toastService.show(error.message, 'error');
			}
		});
	}

	toggleAddMemberToRoster(): void {
		this.isAddMemberToRoster = !this.isAddMemberToRoster;
		if (this.isAddMemberToRoster) {
			this.memberService.getMembersWithoutRoster().subscribe(members => {
				this.membersSubject.next(members);
			});
		}
	}

	handleSelectValueChange($event: Event) {
		if ($event.target && $event.target instanceof HTMLSelectElement && $event.target.value) {
			if ($event.target.value !== '0') {
				this.memberId.setValue($event.target.value);
				this.isButtonDisabled = false;
			} else {
				this.isButtonDisabled = true;
			}
		}
	}

	addMemberToRoster(): void {
		const memberIdValue = this.memberId!.value;
		if (memberIdValue !== null) {
			this.memberService.addMemberToRoster(memberIdValue, this.rosterId).subscribe({
				next: (response) => {
					console.log('✅', response.message);
					this.toastService.show(response.message, 'success');
					this.toggleAddMemberToRoster();
					this.loadRoster(this.rosterId);
				},
				error: (error) => {
					console.error('❌', error.message);
					this.toastService.show(error.message, 'error');
				}
			});
		}

	}
}
