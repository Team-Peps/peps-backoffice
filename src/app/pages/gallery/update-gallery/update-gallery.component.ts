import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '@/app/service/toast.service';
import {GalleryService} from '@/app/service/gallery.service';
import {Gallery} from '@/app/model/gallery';
import {ImageService} from '@/app/service/image.service';
import {environment} from '@/environments/environment';

@Component({
  selector: 'app-update-gallery',
	imports: [
		ReactiveFormsModule
	],
  templateUrl: './update-gallery.component.html',
})
export class UpdateGalleryComponent implements OnChanges {

	constructor(
		private readonly toastService: ToastService,
		private readonly galleryService: GalleryService,
		private readonly cdr: ChangeDetectorRef,
		protected readonly imageService: ImageService,
	) {}

	ngOnChanges(): void {
		this.initForm();
	}

	galleryForm: FormGroup = new FormGroup({
		eventName: new FormControl('', [Validators.required]),
		image: new FormControl(),
		date: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
	});

	selectedFile: File | null = null;
	imagePreview: string | null = null;
	minioBaseUrl = environment.minioBaseUrl;

	@Input() gallery: Gallery | null = null;
	@Output() galleryUpdated: EventEmitter<Gallery | null> = new EventEmitter();

	initForm() {
		if(this.gallery) {
			this.galleryForm.patchValue({
				eventName: this.gallery.eventName,
				date: this.gallery.date,
				description: this.gallery.description,
			});

			this.imagePreview = this.minioBaseUrl + this.gallery.thumbnailImageKey;
		} else {
			this.galleryForm.reset();
			this.imagePreview = null;
		}
		this.cdr.detectChanges();
	}

	saveOrUpdate() {
		if(this.gallery) {
			this.update();
		} else {
			this.save();
		}
	}

	save() {
		if(this.galleryForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		const saveData = { ...this.galleryForm.value };
		delete saveData.image;

		this.galleryService.createGallery(saveData, this.selectedFile!).subscribe({
			next: (response) => {
				this.galleryUpdated.emit();
				this.galleryForm.reset();
				this.imagePreview = "";
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	update() {
		if(this.galleryForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		const updateData = { ...this.galleryForm.value };
		delete updateData.image;
		updateData.thumbnailImageKey = this.gallery!.thumbnailImageKey

		this.galleryService.updateGallery(this.gallery!.id, updateData, this.selectedFile!).subscribe({
			next: (response) => {
				this.galleryUpdated.emit();
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la mise à jour :", error);
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
