import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {SliderService} from '@/app/service/slider.service';
import {ToastService} from '@/app/service/toast.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Slider, SliderPayload} from '@/app/model/slider';
import {NgClass} from '@angular/common';
import {environment} from '@/environments/environment';
import {ImageService} from '@/app/service/image.service';
import {SupportedLang} from '@/app/model/supportedLang';

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
		protected readonly imageService: ImageService,
	) {}

	ngOnChanges(): void {
		this.initForm();
    }

	minioBaseUrl = environment.minioBaseUrl;

	sliderForm: FormGroup = new FormGroup({
		imageFr: new FormControl(),
		imageMobileFr: new FormControl(),

		imageEn: new FormControl(),
		imageMobileEn: new FormControl(),

		ctaLabelFr: new FormControl('',Validators.required),
		ctaLabelEn: new FormControl('',Validators.required),

		ctaLink: new FormControl('',Validators.required),
		isActive: new FormControl(),
	});

	@Input() slider: Slider | null = null;

	@Output() sliderUpdated: EventEmitter<Slider | null> = new EventEmitter();

	selectedFileFr: File | null = null;
	selectedMobileFileFr: File | null = null;

	selectedFileEn: File | null = null;
	selectedMobileFileEn: File | null = null;

	imagePreviewFr: string | null = null;
	imageMobilePreviewFr: string | null = null;

	imagePreviewEn: string | null = null;
	imageMobilePreviewEn: string | null = null;

	linkIsValid: boolean = false;

	initForm(): void {
		if (this.slider) {
			this.sliderForm.patchValue({
				ctaLabelFr: this.slider.translations.fr.ctaLabel,
				ctaLabelEn: this.slider.translations.en.ctaLabel,
				ctaLink: this.slider.ctaLink,
				isActive: this.slider.isActive,
			});
			this.checkLink(this.slider.ctaLink);
			this.imagePreviewFr = this.minioBaseUrl + this.slider.translations.fr.imageKey;
			this.imageMobilePreviewFr = this.minioBaseUrl + this.slider.translations.fr.mobileImageKey;

			this.imagePreviewEn = this.minioBaseUrl + this.slider.translations.en.imageKey;
			this.imageMobilePreviewEn = this.minioBaseUrl + this.slider.translations.en.mobileImageKey;
		}else{
			this.sliderForm.reset();

			this.imagePreviewFr = null;
			this.imageMobilePreviewFr = null;

			this.imagePreviewEn = null;
			this.imageMobilePreviewEn= null;
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
		const { isActive, ctaLink, ctaLabelFr, ctaLabelEn } = this.sliderForm.value;

		const slider: Slider = {
			isActive,
			ctaLink,
			translations: {
				fr: {
					ctaLabel: ctaLabelFr,
					imageKey: '',
					mobileImageKey: ''
				},
				en: {
					ctaLabel: ctaLabelEn,
					imageKey: '',
					mobileImageKey: ''
				}
			}
		};

		const payload: SliderPayload = {
			slider,
			files: {
				fr: {
					image: this.selectedFileFr!,
					mobileImage: this.selectedMobileFileFr!
				},
				en: {
					image: this.selectedFileEn!,
					mobileImage: this.selectedMobileFileEn!
				}
			}
		};

		this.sliderService.createSlider(payload).subscribe({
			next: (response) => {
				this.sliderUpdated.emit();
				this.sliderForm.reset();

				this.imagePreviewFr = "";
				this.imageMobilePreviewFr = "";

				this.imagePreviewEn = "";
				this.imageMobilePreviewEn = "";

				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	update(){
		const { isActive, ctaLink, ctaLabelFr, ctaLabelEn } = this.sliderForm.value;

		const slider: Slider = {
			id: this.slider!.id,
			isActive,
			ctaLink,
			translations: {
				fr: {
					ctaLabel: ctaLabelFr,
					imageKey: this.slider!.translations.fr.imageKey,
					mobileImageKey: this.slider!.translations.fr.mobileImageKey
				},
				en: {
					ctaLabel: ctaLabelEn,
					imageKey: this.slider!.translations.en.imageKey,
					mobileImageKey: this.slider!.translations.en.mobileImageKey
				}
			}
		};

		const payload: SliderPayload = {
			slider,
			files: {
				fr: {
					image: this.selectedFileFr!,
					mobileImage: this.selectedMobileFileFr!
				},
				en: {
					image: this.selectedFileEn!,
					mobileImage: this.selectedMobileFileEn!
				}
			}
		};

		this.sliderService.updateSlider(payload).subscribe({
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

	async onFileSelected(event: Event, typeImg: string, lang: SupportedLang): Promise<void> {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];

			if(this.imageService.checkSize(file) && this.imageService.checkFormat(file)) {
				if(typeImg === 'desktop') {

					if(lang === 'fr') {
						this.selectedFileFr = file;
						const reader = new FileReader();
						reader.onload = () => {
							this.imagePreviewFr = reader.result as string;
						};
						reader.readAsDataURL(file!);
					} else if (lang === 'en') {
						this.selectedFileEn = file;
						const reader = new FileReader();
						reader.onload = () => {
							this.imagePreviewEn = reader.result as string;
						};
						reader.readAsDataURL(file!);
					}

				} else {

					if(lang === 'fr') {
						this.selectedMobileFileFr = file;
						const reader = new FileReader();
						reader.onload = () => {
							this.imageMobilePreviewFr = reader.result as string;
						};
						reader.readAsDataURL(file!);
					} else if (lang === 'en') {
						this.selectedMobileFileEn = file;
						const reader = new FileReader();
						reader.onload = () => {
							this.imageMobilePreviewEn = reader.result as string;
						};
						reader.readAsDataURL(file!);
					}

				}
				this.toastService.show('Nouvelle image chargée', 'success');

			}else{
				input.value = "";
			}
		}
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
