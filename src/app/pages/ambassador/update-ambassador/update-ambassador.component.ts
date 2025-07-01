import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {AmbassadorService} from '@/app/service/ambassador.service';
import {ToastService} from '@/app/service/toast.service';
import {environment} from '@/environments/environment';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Ambassador, AmbassadorPayload} from '@/app/model/ambassador';
import {ImageService} from '@/app/service/image.service';

@Component({
	selector: 'app-update-ambassador',
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './update-ambassador.component.html',
})
export class UpdateAmbassadorComponent implements OnChanges {

	constructor(
		private readonly ambassadorService: AmbassadorService,
		private readonly toastService: ToastService,
		private readonly cdr: ChangeDetectorRef,
		protected readonly imageService: ImageService,
	) {}

	ngOnChanges(): void {
		this.initForm();
    }

	minioBaseUrl = environment.minioBaseUrl;

	ambassadorForm: FormGroup = new FormGroup({
		name: new FormControl(Validators.required),
		image: new FormControl(),

		descriptionFr: new FormControl(Validators.required),
		descriptionEn: new FormControl(Validators.required),

		twitterXUsername: new FormControl(),
		instagramUsername: new FormControl(),
		tiktokUsername: new FormControl(),
		youtubeUsername: new FormControl(),
		twitchUsername: new FormControl(),
	});

	@Input() ambassador: Ambassador | null = null;
	@Output() ambassadorUpdated: EventEmitter<Ambassador | null> = new EventEmitter();

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	initForm(): void {
		if (this.ambassador) {
			this.ambassadorForm.patchValue({
				name: this.ambassador.name,
				descriptionFr: this.ambassador.translations.fr.description,
				descriptionEn: this.ambassador.translations.en.description,
				twitterXUsername: this.ambassador.twitterXUsername,
				instagramUsername: this.ambassador.instagramUsername,
				tiktokUsername: this.ambassador.tiktokUsername,
				youtubeUsername: this.ambassador.youtubeUsername,
				twitchUsername: this.ambassador.twitchUsername
			});

			this.imagePreview = this.minioBaseUrl + this.ambassador.imageKey;
		}else{
			this.ambassadorForm.reset();
			this.imagePreview = null;
		}
		this.cdr.detectChanges();
	}

	saveOrUpdateAmbassador(): void {
		if(this.ambassadorForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		if(this.ambassador){
			this.update();
		}else{
			this.save();
		}
	}

	save() {

		const {name, descriptionFr, descriptionEn, twitterXUsername, instagramUsername, tiktokUsername, youtubeUsername, twitchUsername} = this.ambassadorForm.value;

		const ambassador: Ambassador = {
			name,
			instagramUsername,
			twitchUsername,
			tiktokUsername,
			twitterXUsername,
			youtubeUsername,
			translations: {
				fr: {
					description: descriptionFr,
				},
				en: {
					description: descriptionEn,
				}
			}
		};

		const payload: AmbassadorPayload = {
			ambassador,
			image: this.selectedFile!
		}

		this.ambassadorService.saveAmbassador(payload).subscribe({
			next: (response) => {
				this.ambassadorUpdated.emit();
				this.ambassadorForm.reset();
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
		const {name, descriptionFr, descriptionEn, twitterXUsername, instagramUsername, tiktokUsername, youtubeUsername, twitchUsername} = this.ambassadorForm.value;

		const ambassador: Ambassador = {
			id: this.ambassador!.id,
			name,
			instagramUsername,
			twitchUsername,
			tiktokUsername,
			twitterXUsername,
			youtubeUsername,
			translations: {
				fr: {
					description: descriptionFr,
				},
				en: {
					description: descriptionEn,
				}
			}
		}

		const payload: AmbassadorPayload = {
			ambassador,
			image: this.selectedFile!
		}

		this.ambassadorService.updateAmbassador(payload).subscribe({
			next: (response) => {
				this.ambassadorUpdated.emit();
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
}
