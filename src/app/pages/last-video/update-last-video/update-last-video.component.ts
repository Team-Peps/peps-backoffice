import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ToastService} from '@/app/service/toast.service';
import { VideoService } from '@/app/service/video.service';
import {environment} from '@/environments/environment';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Video } from '@/app/model/video';
import {NgClass} from '@angular/common';

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
	) {}


	ngOnChanges(): void {
		this.initForm();
    }

	minioBaseUrl = environment.minioBaseUrl;

	videoForm: FormGroup = new FormGroup({
		title: new FormControl(),
		link: new FormControl(),
	});

	@Input() video: Video | null = null;

	@Output() videoUpdated: EventEmitter<Video | null> = new EventEmitter();

	linkIsValid: boolean = false;

	initForm(): void {
		if (this.video) {
			this.videoForm.patchValue({
				title: this.video.title,
				link: this.video.link,
			});
			this.checkLink(this.video.link);
		} else {
			this.videoForm.reset();
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
		this.videoService.createVideo(this.videoForm.value).subscribe({
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

		this.videoService.updateVideo(updateData).subscribe({
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
}
