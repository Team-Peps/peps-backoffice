import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {Member} from '../../../../model/member/member';
import {environment} from '@/environments/environment';
import {MemberRole} from '../../../../model/member/memberRole';
import {determineRoleIcon} from '../../../../core/utils/range';

@Component({
	selector: 'member-table',
	imports: [
		NgOptimizedImage
	],
	templateUrl: './memberTable.component.html',
})
export class MemberTableComponent {

	@Input() members: Member[] = [];
	@Input() countMembers: number = 0;

	@Output() memberToUpdate: EventEmitter<Member> = new EventEmitter();
	@Output() memberToSubstitute: EventEmitter<Member> = new EventEmitter();
	@Output() memberToActive: EventEmitter<Member> = new EventEmitter();
	@Output() memberToRemove: EventEmitter<Member> = new EventEmitter();

	minioBaseUrl = environment.minioBaseUrl;

	protected readonly determineRoleIcon = determineRoleIcon;
	protected readonly MemberRole = MemberRole;

	selectMember(member: Member) {
		this.memberToUpdate.emit(member);
	}


	toggleSubstitute(member: Member) {
		this.memberToSubstitute.emit(member);
	}

	toggleActive(member: Member) {
		this.memberToActive.emit(member);
	}

	removeFromTeam(member: Member) {
		this.memberToRemove.emit(member);
	}
}
