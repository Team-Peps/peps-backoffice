import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {environment} from '@/environments/environment';
import {Partner, PartnerCode} from '@/app/model/partner';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {Slider} from '@/app/model/slider';

@Component({
	selector: 'partner-table',
	imports: [
		NgOptimizedImage,
		CdkDrag,
		CdkDropList,
		NgClass
	],
	templateUrl: './partner-table.component.html',
})
export class PartnerTableComponent {

	@Input() partners: Partner[] = [];

	@Output() partnerToUpdate: EventEmitter<Partner> = new EventEmitter();
	@Output() partnerToActive: EventEmitter<Partner> = new EventEmitter();
	@Output() partnerToDelete: EventEmitter<Partner> = new EventEmitter();
	@Output() orderChanged: EventEmitter<string[]> = new EventEmitter();

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

	drop($event: CdkDragDrop<Slider[]>) {
		moveItemInArray(this.partners, $event.previousIndex, $event.currentIndex);
		const newOrder = this.partners.map(partner => partner.id);
		this.orderChanged.emit(newOrder);
	}

	showCodes(codes: PartnerCode[]) {
		if (codes.length === 0) {
			return 'Aucun code';
		}
		return codes.map(code => code.code).join(', ');

	}
}
