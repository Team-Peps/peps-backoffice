import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MemberService} from '../../../service/member.service';
import {BehaviorSubject} from 'rxjs';
import {Member, PepsMember} from '../../../model/member/member';
import {AsyncPipe} from '@angular/common';
import {UpdatePepsMemberComponent} from '../update-peps-member/update-peps-member.component';

@Component({
  selector: 'app-peps-member-list',
	imports: [
		AsyncPipe,
		UpdatePepsMemberComponent
	],
  templateUrl: './peps-member-list.component.html',
})
export class PepsMemberListComponent implements OnInit {

	constructor(
	  private readonly memberService: MemberService,
	  private cdr: ChangeDetectorRef,
	) {}

	private membersSubjet = new BehaviorSubject<PepsMember[]>([]);
	members$ = this.membersSubjet.asObservable();
	selectedMember: PepsMember | null = null;
	isCreateMember: boolean = false;

	ngOnInit() {
		this.loadMembers();
	}

	loadMembers(): void {
		this.memberService.getPepsMembers().subscribe(members => {
			this.membersSubjet.next(members);
		});
	}

	selectMember(pepsMember: PepsMember) {
		this.selectedMember = pepsMember;
		this.isCreateMember = false;
		this.cdr.detectChanges();
		document.getElementById('updateMember')?.scrollIntoView({behavior: 'smooth'});
	}

	toggleCreateMember() {
		this.isCreateMember = !this.isCreateMember;
		this.selectedMember = null;
		this.cdr.detectChanges();
	}
}
