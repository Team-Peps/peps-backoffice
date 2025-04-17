import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PartnerService} from '../../../service/partner.service';
import {ToastService} from '../../../service/toast.service';
import {environment} from '@/environments/environment';
import {Partner} from '../../../model/partner';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

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
	) {}

	ngOnChanges(): void {
		this.initForm();
    }

	minioBaseUrl = environment.minioBaseUrl;

	partnerForm: FormGroup = new FormGroup({
		name: new FormControl(Validators.required),
		description: new FormControl(Validators.required),
		image: new FormControl(),
		link: new FormControl(Validators.required),
		codes: new FormControl(Validators.required),
		isActive: new FormControl(),
	});

	@Input() partner: Partner | null = null;

	@Output() partnerUpdated: EventEmitter<Partner | null> = new EventEmitter();

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	initForm(): void {
		if (this.partner) {
			this.partnerForm.patchValue({
				name: this.partner.name,
				description: this.partner.description,
				link: this.partner.link,
				codes: this.partner.codes.join(","),
				isActive: this.partner.isActive,
			});

			this.imagePreview = this.minioBaseUrl + this.partner.imageKey;
		}else{
			this.partnerForm.reset();
			this.imagePreview = null;
		}
		this.cdr.detectChanges();
	}

	saveOrUpdatePartner(): void {
		if(this.partner){
			this.update();
		}else{
			this.save();
		}
	}

	save() {
		if(this.partnerForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}
		const saveData = { ...this.partnerForm.value };
		delete saveData.image;

		this.partnerService.savePartner(saveData, this.selectedFile!).subscribe({
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
		const updateData = { ...this.partnerForm.value, id: this.partner!.id };

		delete updateData.image;
		updateData.imageKey = this.partner!.imageKey;

		this.partnerService.updatePartner(updateData, this.selectedFile!).subscribe({
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

			if(this.checkSize(file)) {
				this.selectedFile = file;
				this.toastService.show('Nouvelle image chargée', 'success');

				this.createPreview()
			}else{
				input.value = "";
			}
		}
	}

	checkSize(file: File): boolean {
		if(file.size > 5 * 1024 * 1024) {
			this.toastService.show('L\'image ne doit pas dépasser 5 Mo', 'error');
			return false;
		}
		return true;
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
}
