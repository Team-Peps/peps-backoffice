import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {PartnerService} from '@/app/service/partner.service';
import {ToastService} from '@/app/service/toast.service';
import {environment} from '@/environments/environment';
import {Partner, PartnerCode, PartnerPayload} from '@/app/model/partner';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ImageService} from '@/app/service/image.service';

@Component({
	selector: 'app-update-partner',
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './update-partner.component.html',
})
export class UpdatePartnerComponent implements OnChanges {

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly partnerService: PartnerService,
		private readonly toastService: ToastService,
		protected readonly imageService: ImageService,
	) {}

	ngOnChanges(): void {
		this.initForm();
    }

	minioBaseUrl = environment.minioBaseUrl;

	partnerForm: FormGroup = new FormGroup({
		name: new FormControl(Validators.required),

		descriptionFr: new FormControl(Validators.required),
		descriptionEn: new FormControl(Validators.required),

		image: new FormControl(),
		link: new FormControl(Validators.required),
		codes: new FormArray([]),
		isActive: new FormControl(),
		order: new FormControl(),
		type: new FormControl(Validators.required),
	});

	@Input() partner: Partner | null = null;

	@Output() partnerUpdated: EventEmitter<Partner | null> = new EventEmitter();

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	initForm(): void {
		if (this.partner) {

			this.partnerForm.patchValue({
				name: this.partner.name,
				link: this.partner.link,
				isActive: this.partner.isActive,
				order: this.partner.order,
				type: this.partner.type,
			});
			if(this.partner.type === 'MAJOR') {
				this.partnerForm.patchValue({
					descriptionFr: this.partner.translations.fr.description,
					descriptionEn: this.partner.translations.en.description,
				})
			}
			const codesArray = this.partnerForm.get('codes') as FormArray;
			codesArray.clear();

			if(this.partner.codes && Array.isArray(this.partner.codes)) {
				this.partner.codes.forEach((codeObj: PartnerCode) => {
					const codeGroup = new FormGroup({
						code: new FormControl(codeObj.code, Validators.required),
						descriptionFr: new FormControl(codeObj.descriptionFr, Validators.required),
						descriptionEn: new FormControl(codeObj.descriptionEn, Validators.required),
					});
					codesArray.push(codeGroup);
				});
			}

			this.imagePreview = this.minioBaseUrl + this.partner.imageKey;
		}else{
			this.partnerForm.reset();
			(this.partnerForm.get('codes') as FormArray).clear();
			this.imagePreview = null;
		}
		this.cdr.detectChanges();
	}

	addCode(): void {
		const codeGroup = new FormGroup({
			code: new FormControl('', Validators.required),
			descriptionFr: new FormControl('', Validators.required),
			descriptionEn: new FormControl('', Validators.required),
		});
		(this.partnerForm.get('codes') as FormArray).push(codeGroup);
	}

	removeCode(index: number): void {
		(this.partnerForm.get('codes') as FormArray).removeAt(index);
	}

	saveOrUpdatePartner(): void {
		if(this.partnerForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		if(!this.checkCodeValidity(this.partnerForm.value.codes)) {
			return;
		}

		if(this.partner){
			this.update();
		}else{
			this.save();
		}
	}

	save() {
		const {name, descriptionFr, descriptionEn, link, isActive, order, type, codes} = this.partnerForm.value;

		const partner: Partner = {
			name,
			translations: {
				fr: { description: descriptionFr },
				en: { description: descriptionEn }
			},
			link,
			isActive,
			order,
			type,
			codes: codes.map((code: any) => ({
				code: code.code.trim(),
				descriptionFr: code.descriptionFr.trim(),
				descriptionEn: code.descriptionEn.trim()
			})),
		};

		const payload: PartnerPayload = {
			partner,
			image: this.selectedFile!
		}

		this.partnerService.savePartner(payload).subscribe({
			next: (response) => {
				this.partnerUpdated.emit();
				this.partnerForm.reset();
				this.imagePreview = "";
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	update(){
		const {name, descriptionFr, descriptionEn, link, isActive, order, type, codes} = this.partnerForm.value;

		const partner: Partner = {
			id: this.partner!.id,
			name,
			translations: {
				fr: { description: descriptionFr },
				en: { description: descriptionEn }
			},
			link,
			isActive,
			order,
			type,
			codes: codes.map((code: any) => ({
				code: code.code.trim(),
				descriptionFr: code.descriptionFr.trim(),
				descriptionEn: code.descriptionEn.trim()
			})),
		};

		const payload: PartnerPayload = {
			partner,
			image: this.selectedFile!
		}

		this.partnerService.updatePartner(payload).subscribe({
			next: (response) => {
				this.partnerUpdated.emit();
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	async onFileSelected(event: Event): Promise<void> {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];

			if(this.imageService.checkSize(file) && this.imageService.checkFormat(file)) {
				this.selectedFile = file;
				this.toastService.show('Nouvelle image chargée', 'success');

				this.createPreview()
			}else{
				input.value = "";
			}
		}
	}

	createPreview(file: File | null = this.selectedFile): void {
		const reader = new FileReader();
		reader.onload = () => {
			this.imagePreview = reader.result as string;
		};
		reader.readAsDataURL(file!);
	}

	handleUploadFile() {
		const fileInput = document.getElementById('fileInput') as HTMLInputElement;
		fileInput.click();
	}

	checkPartnerLink($event: Event) {
		const target = $event.target as HTMLInputElement;
		const link = target.value;
		const linkRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

		if(!linkRegex.test(link)) {
			target.setCustomValidity('Le lien doit être une URL valide');
		}else{
			target.setCustomValidity('');
		}
		target.reportValidity();
	}

	checkCodeValidity(codes: PartnerCode[]) {

		const hasInvalidCode = codes?.some(
			(code: any) => !code.code?.trim() || !code.descriptionEn?.trim() || !code.descriptionFr?.trim()
		);

		if (hasInvalidCode) {
			this.toastService.show('Les codes doivent avoir un code ET une description', 'error');
			return false;
		}

		const uniqueCodes = new Set(codes.map(code => code.code.trim()));

		if (uniqueCodes.size !== codes.length) {
			this.toastService.show('Les codes doivent être uniques', 'error');
			return false;
		}

		return true;
	}

}
