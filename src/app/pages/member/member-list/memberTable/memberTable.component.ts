import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {Member} from '../../../../model/member/member';
import {environment} from '../../../../../environment/environment';
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

	selectMember(member: Member) {
		this.memberToUpdate.emit(member);
	}

	protected readonly MemberRole = MemberRole;

	setSubstitute(member: Member) {
		this.memberToSubstitute.emit(member);
	}

	setActive(member: Member) {
		this.memberToActive.emit(member);

	}

	removeFromTeam(member: Member) {
		this.memberToRemove.emit(member);
	}

	protected readonly determineRoleIcon = determineRoleIcon;
}
