import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {AmbassadorService} from '../../../service/ambassador.service';
import {ToastService} from '../../../service/toast.service';
import {environment} from '../../../../environment/environment';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Ambassador} from '../../../model/ambassador';

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
	) {}

	ngOnChanges(): void {
		this.initForm();
    }

	minioBaseUrl = environment.minioBaseUrl;

	ambassadorForm: FormGroup = new FormGroup({
		name: new FormControl(Validators.required),
		image: new FormControl(),
		description: new FormControl(Validators.required),
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
				description: this.ambassador.description,
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
		if(this.ambassador){
			console.log("update")
			this.update();
		}else{
			this.save();
		}
	}

	save() {
		if(this.ambassadorForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}
		const saveData = { ...this.ambassadorForm.value };
		delete saveData.image;

		this.ambassadorService.saveAmbassador(saveData, this.selectedFile!).subscribe({
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
		const updateData = { ...this.ambassadorForm.value, id: this.ambassador!.id };

		delete updateData.image;
		updateData.imageKey = this.ambassador!.imageKey;

		this.ambassadorService.updateAmbassador(updateData, this.selectedFile!).subscribe({
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
}
