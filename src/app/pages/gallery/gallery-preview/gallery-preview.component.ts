import {
	ChangeDetectorRef,
	Component, ElementRef,
	EventEmitter,
	Input,
	Output, ViewChild
} from '@angular/core';
import {GalleryPhoto} from '@/app/model/galleryPhoto';
import {environment} from '@/environments/environment';
import {Gallery} from '@/app/model/gallery';

@Component({
  selector: 'gallery-preview',
  imports: [],
  templateUrl: './gallery-preview.component.html',
})
export class GalleryPreviewComponent {

	constructor() {}

	minioBaseUrl = environment.minioBaseUrl;

	@Output() photoToDelete: EventEmitter<GalleryPhoto> = new EventEmitter();
	@Input() gallery: Gallery | null = null;

	onImageLoad(event: Event) {
		const img = event.target as HTMLImageElement;
		img.classList.remove('opacity-0');
		img.classList.add('opacity-100');
	}

	deletePhoto(photo: GalleryPhoto) {
		this.photoToDelete.emit(photo);
	}
}
