import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ToastService} from '@/app/service/toast.service';
import { VideoService } from '@/app/service/video.service';
import {environment} from '@/environments/environment';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Video } from '@/app/model/video';
import {NgClass} from '@angular/common';
import {ImageService} from '@/app/service/image.service';

@Component({
	selector: 'app-update-last-video',
	imports: [
		ReactiveFormsModule,
		NgClass
	],
	templateUrl: './update-last-video.component.html',
})
export class UpdateLastVideoComponent implements OnChanges {

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly videoService: VideoService,
		private readonly toastService: ToastService,
		protected readonly imageService: ImageService,
	) {}


	ngOnChanges(): void {
		this.initForm();
    }

	minioBaseUrl = environment.minioBaseUrl;

	videoForm: FormGroup = new FormGroup({
		link: new FormControl(),
		image: new FormControl(),
	});

	@Input() video: Video | null = null;

	@Output() videoUpdated: EventEmitter<Video | null> = new EventEmitter();

	linkIsValid: boolean = false;

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	initForm(): void {
		if (this.video) {
			this.videoForm.patchValue({
				link: this.video.link,
			});
			this.imagePreview = this.minioBaseUrl + this.video.imageKey;

			this.checkLink(this.video.link);
		} else {
			this.videoForm.reset();
			this.imagePreview = null;
		}
		this.cdr.detectChanges();
	}

	saveOrUpdateVideo() {
		if(this.videoForm.invalid || !this.checkLink(this.videoForm.get('link')!.value)) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		if(this.video) {
			this.update();
		}else{
			this.save();
		}
	}

	save(): void {
		if(this.videoForm.invalid || !this.checkLink(this.videoForm.get('link')!.value)) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		const saveData = { ...this.videoForm.value };
		delete saveData.image;

		this.videoService.createVideo(saveData, this.selectedFile!).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.videoUpdated.emit(res.video);
				this.videoForm.reset();
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	update(): void {
		const updateData = { ...this.videoForm.value, id: this.video!.id };

		delete updateData.image;
		updateData.imageKey = this.video!.imageKey;

		this.videoService.updateVideo(updateData, this.selectedFile!).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.videoUpdated.emit(res.video);
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	checkLink(value: string) {
		const linkRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
		this.linkIsValid = linkRegex.test(value);
		return this.linkIsValid;
	}

	checkVideoLink($event: Event) {
		const target = $event.target as HTMLInputElement;
		const link = target.value;

		if(!this.checkLink(link)) {
			target.setCustomValidity('Le lien doit être une URL valide');
		}else{
			target.setCustomValidity('');
		}
		target.reportValidity();
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
