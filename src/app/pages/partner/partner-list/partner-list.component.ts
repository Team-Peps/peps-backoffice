import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PartnerService} from '@/app/service/partner.service';
import {environment} from '@/environments/environment';
import {Partner} from '@/app/model/partner';
import {ToastService} from '@/app/service/toast.service';
import {UpdatePartnerComponent} from '../update-partner/update-partner.component';
import {PartnerTableComponent} from './partnerTable/partner-table.component';

@Component({
  selector: 'app-partner-list',
	imports: [
		UpdatePartnerComponent,
		PartnerTableComponent
	],
  templateUrl: './partner-list.component.html',
})
export class PartnerListComponent implements OnInit {

	constructor(
  		private readonly partnerService: PartnerService,
		private readonly cdr: ChangeDetectorRef,
		private readonly toastService: ToastService
	) {}

	minioBaseUrl = environment.minioBaseUrl;

	partnersActive: Partner[] = [];
	partnersInactive: Partner[] = [];

	selectedPartner: Partner | null = null;
	isCreatePartner: boolean = false;

	ngOnInit(): void {
		this.loadPartners();
	}

	loadPartners(): void {
		this.partnerService.getPartners().subscribe(response => {
			this.partnersActive = response["activePartners"];
			this.partnersInactive = response["inactivePartners"];
			this.cdr.detectChanges();
		});
	}

	selectPartner(partner: Partner) {
		this.selectedPartner = partner;
		this.isCreatePartner = false;
		this.cdr.detectChanges();
		document.getElementById('updatePartner')?.scrollIntoView({behavior: 'smooth'});
	}

	toggleActive(partner: Partner) {
		this.partnerService.toggleActive(partner.id).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.loadPartners();
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
			}
		})
	}

	deletePartner(partner: Partner) {
		this.partnerService.deletePartner(partner.id).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.loadPartners();
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
			}
		})
	}

	toggleCreatePartner() {
		this.isCreatePartner = !this.isCreatePartner;
		this.selectedPartner = null;
		this.cdr.detectChanges();
	}
}
