import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {Member} from '../../../../model/member/member';
import {environment} from '@/environments/environment';
import {MemberRole} from '../../../../model/member/memberRole';
import {Partner} from '../../../../model/partner';

@Component({
	selector: 'partner-table',
	imports: [
		NgOptimizedImage
	],
	templateUrl: './partner-table.component.html',
})
export class PartnerTableComponent {

	@Input() partners: Partner[] = [];

	@Output() partnerToUpdate: EventEmitter<Partner> = new EventEmitter();
	@Output() partnerToActive: EventEmitter<Partner> = new EventEmitter();
	@Output() partnerToDelete: EventEmitter<Partner> = new EventEmitter();

	minioBaseUrl = environment.minioBaseUrl;

	selectPartner(partner: Partner) {
		this.partnerToUpdate.emit(partner);
	}

	toggleActive(partner: Partner) {
		this.partnerToActive.emit(partner);
	}

	deletePartner(partner: Partner) {
		this.partnerToDelete.emit(partner);
	}
}
