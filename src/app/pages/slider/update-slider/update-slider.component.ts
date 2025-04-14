import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {SliderService} from '../../../service/slider.service';
import {ToastService} from '../../../service/toast.service';
import {environment} from '../../../../environment/environment';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Slider} from '../../../model/slider';
import {NgClass} from '@angular/common';

@Component({
	selector: 'app-update-slider',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		NgClass
	],
	templateUrl: './update-slider.component.html',
})
export class UpdateSliderComponent implements OnChanges {

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly sliderService: SliderService,
		private readonly toastService: ToastService,
	) {
	}

	ngOnChanges(): void {
		this.initForm();
    }

	minioBaseUrl = environment.minioBaseUrl;

	sliderForm: FormGroup = new FormGroup({
		image: new FormControl(),
		imageMobile: new FormControl(),
		ctaLabel: new FormControl('',Validators.required),
		ctaLink: new FormControl('',Validators.required),
		isActive: new FormControl(),
	});

	@Input() slider: Slider | null = null;

	@Output() sliderUpdated: EventEmitter<Slider | null> = new EventEmitter();

	selectedFile: File | null = null;
	selectedMobileFile: File | null = null;

	imagePreview: string | null = null;
	imageMobilePreview: string | null = null;
	linkIsValid: boolean = false;

	initForm(): void {
		if (this.slider) {
			this.sliderForm.patchValue({
				ctaLabel: this.slider.ctaLabel,
				ctaLink: this.slider.ctaLink,
				isActive: this.slider.isActive,
			});
			this.checkLink(this.slider.ctaLink);
			this.imagePreview = this.minioBaseUrl + this.slider.imageKey;
			this.imageMobilePreview = this.minioBaseUrl + this.slider.mobileImageKey;
		}else{
			this.sliderForm.reset();
			this.imagePreview = null;
			this.imageMobilePreview = null;
		}
		this.cdr.detectChanges();
	}

	saveOrUpdateSlider() {
		if(this.sliderForm.invalid || !this.checkLink(this.sliderForm.get('ctaLink')!.value)) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		if(this.slider){
			this.update();
		}else{
			this.save();
		}
	}

	save() {
		const saveData = { ...this.sliderForm.value };
		delete saveData.image;
		delete saveData.imageMobile;

		this.sliderService.createSlider(saveData, this.selectedFile!, this.selectedMobileFile!).subscribe({
			next: (response) => {
				this.sliderUpdated.emit();
				this.sliderForm.reset();
				this.imagePreview = "";
				this.imageMobilePreview = "";
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	update(){
		const updateData = { ...this.sliderForm.value, id: this.slider!.id };

		delete updateData.image;
		delete updateData.imageMobile;
		updateData.imageKey = this.slider!.imageKey;
		updateData.mobileImageKey = this.slider!.mobileImageKey;

		this.sliderService.updateSlider(updateData, this.selectedFile!, this.selectedMobileFile!).subscribe({
			next: (response) => {
				this.sliderUpdated.emit();
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	async onFileSelected(event: Event, typeImg: string): Promise<void> {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];

			if(this.checkSize(file)) {
				if(typeImg === 'desktop') {

					this.selectedFile = file;
					const reader = new FileReader();
					reader.onload = () => {
						this.imagePreview = reader.result as string;
					};
					reader.readAsDataURL(file!);
				} else {
					this.selectedMobileFile = file;
					const reader = new FileReader();
					reader.onload = () => {
						this.imageMobilePreview = reader.result as string;
					};
					reader.readAsDataURL(file!);
				}
				this.toastService.show('Nouvelle image chargée', 'success');

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

	handleUploadFile(imageType: string) {
		const fileInput = document.getElementById(imageType) as HTMLInputElement;
		fileInput.click();
	}

	checkLink(value: string) {
		const linkRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
		this.linkIsValid = linkRegex.test(value);
		return this.linkIsValid;
	}

	checkSliderLink($event: Event) {
		const target = $event.target as HTMLInputElement;
		const link = target.value;

		if(!this.checkLink(link)) {
			target.setCustomValidity('Le lien doit être une URL valide');
		}else{
			target.setCustomValidity('');
		}
		target.reportValidity();
	}

}
