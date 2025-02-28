import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MemberService} from '../../../service/member.service';
import {BehaviorSubject} from 'rxjs';
import {Member} from '../../../model/member';
import {AsyncPipe} from '@angular/common';
import {UpdateMemberComponent} from '../update-member/update-member.component';

@Component({
  selector: 'app-member-list',
	imports: [
		AsyncPipe,
		UpdateMemberComponent
	],
  templateUrl: './member-list.component.html',
})
export class MemberListComponent implements OnInit {

	constructor(
	  private readonly memberService: MemberService,
	  private cdr: ChangeDetectorRef,
	) {}

	private membersSubjet = new BehaviorSubject<Member[]>([]);
	members$ = this.membersSubjet.asObservable();
	selectedMember: Member | null = null;

	ngOnInit() {
		this.loadMembers();
	}

	loadMembers(): void {
		this.memberService.getMembers().subscribe(members => {
			this.membersSubjet.next(members);
		});
	}

	selectMember(member: Member) {
		this.selectedMember = member;
		this.cdr.detectChanges();
		document.getElementById('updateMember')?.scrollIntoView({behavior: 'smooth'});
	}
}
