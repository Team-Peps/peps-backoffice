import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ToastService} from '@/app/service/toast.service';
import { GalleryService } from '@/app/service/gallery.service';
import {Gallery} from '@/app/model/gallery';
import {ReactiveFormsModule} from '@angular/forms';
import {UpdateGalleryComponent} from '@/app/pages/gallery/update-gallery/update-gallery.component';
import {GalleryTableComponent} from '@/app/pages/gallery/gallery-list/gallery-table/gallery-table.component';
import {GalleryPreviewComponent} from '@/app/pages/gallery/gallery-preview/gallery-preview.component';
import {GalleryPhoto} from '@/app/model/galleryPhoto';
import {GalleryUploadComponent} from '@/app/pages/gallery/gallery-upload/gallery-upload.component';
import {ModalComponent} from '@/app/core/components/modal/modal.component';

@Component({
  selector: 'app-gallery-list',
	imports: [
		ReactiveFormsModule,
		UpdateGalleryComponent,
		GalleryTableComponent,
		GalleryPreviewComponent,
		GalleryUploadComponent,
		ModalComponent
	],
  templateUrl: './gallery-list.component.html',
})
export class GalleryListComponent implements OnInit {

	constructor(
		private readonly galleryService: GalleryService,
		private readonly toastService: ToastService,
		private readonly cdr: ChangeDetectorRef
	) {}

	selectedGallery: Gallery | null = null;
	previewGallery: Gallery | null = null;
	addingPhotoGallery: Gallery | null = null;
	deletingGallery: Gallery | null = null;

	galleries: Gallery[] = [];

	isCreatedGallery: boolean = false;
	isShowingModal: boolean = false;
	isShowingDeleteModal: boolean = false;

	ngOnInit(): void {
		this.loadGalleries();
	}

	loadGalleries() {
		this.galleryService.getAllGalleries().subscribe({
			next: (galleries) => {
				this.galleries = galleries;
			},
			error: (err) => console.error(err)
		});
	}

	selectGallery(gallery: Gallery) {
		this.selectedGallery = gallery;
		this.isCreatedGallery = false;
		document.getElementById('updateGallery')?.scrollIntoView({behavior: 'smooth'});
	}

	toggleCreateGallery() {
		this.isCreatedGallery = !this.isCreatedGallery;
	}

	cancelCreateGallery() {
		this.isCreatedGallery = false;
		this.selectedGallery = null;
	}

	wantToDeleteGallery(gallery: Gallery) {
		this.isShowingDeleteModal = true;
		this.deletingGallery = gallery;
	}

	deleteGallery(gallery: Gallery) {
		this.galleryService.deleteGallery(gallery.id).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.loadGalleries();
				this.deletingGallery = null;
				this.isShowingDeleteModal = false;
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
			}
		})
	}

	viewGallery($event: Gallery) {
		this.previewGallery = $event;
		document.getElementById('galleryPreview')?.scrollIntoView({behavior: 'smooth'});
	}

	addPhotos($event: Gallery) {
		this.addingPhotoGallery = $event;
		this.isShowingModal = true;
	}

	deletePhoto(photo: GalleryPhoto) {
		this.galleryService.deletePhoto(photo.id).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');

				if (this.previewGallery?.photos) {
					this.previewGallery.photos = this.previewGallery.photos.filter(p => p.id !== photo.id);
					this.previewGallery = { ...this.previewGallery };
					this.cdr.detectChanges();

				}
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
			}
		});
	}

	closeModal() {
		this.isShowingModal = false;
		this.addingPhotoGallery = null;
	}

	cancelDeleteGallery() {
		this.deletingGallery = null;
		this.isShowingDeleteModal = false;
	}
}
