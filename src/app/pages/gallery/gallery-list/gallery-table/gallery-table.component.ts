import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Gallery} from '@/app/model/gallery';
import {DatePipe, NgClass, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'gallery-table',
	imports: [
		NgOptimizedImage,
		DatePipe,
		NgClass
	],
  templateUrl: './gallery-table.component.html',
})
export class GalleryTableComponent {

	@Input() galleries: Gallery[] = [];

	@Output() galleryToUpdate: EventEmitter<Gallery> = new EventEmitter();
	@Output() galleryToDelete: EventEmitter<Gallery> = new EventEmitter();
	@Output() galleryToView: EventEmitter<Gallery> = new EventEmitter();
	@Output() galleryToAddPhotos: EventEmitter<Gallery> = new EventEmitter();

	selectGallery(gallery: Gallery) {
		this.galleryToUpdate.emit(gallery);
	}

	deleteGallery(gallery: Gallery) {
		this.galleryToDelete.emit(gallery);
	}

	viewGallery(gallery: Gallery) {
		this.galleryToView.emit(gallery);
	}

	addPhotos(gallery: Gallery) {
		this.galleryToAddPhotos.emit(gallery);
	}
}
