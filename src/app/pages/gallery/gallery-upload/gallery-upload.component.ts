import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Gallery} from '@/app/model/gallery';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { GalleryService } from '@/app/service/gallery.service';
import {HttpEventType} from '@angular/common/http';
import {NgClass} from '@angular/common';
import {AuthorService} from '@/app/service/author.service';
import {Author} from '@/app/model/author';

@Component({
  selector: 'gallery-upload',
	imports: [
		ReactiveFormsModule,
		NgClass
	],
  templateUrl: './gallery-upload.component.html',
})
export class GalleryUploadComponent implements OnInit {

	constructor(
		private readonly galleryService: GalleryService,
		private readonly authorService: AuthorService,
	) {}

	@Input() gallery!: Gallery;
	@Output() close = new EventEmitter<void>();
	@Output() uploaded = new EventEmitter<Gallery | null>();

	isUploading: boolean = false;
	uploadProgress: number = 0;

	selectedFile: File | null = null;

	form: FormGroup = new FormGroup({
		author: new FormControl('', Validators.required),
	});

	authors: Author[] = [];

	ngOnInit() {
		this.authorService.getAllAuthors().subscribe({
			next: (res) => {
				this.authors = res;
			},
			error: (err) => {
				console.error('Erreur lors de la récupération des auteurs :', err);
			}
		});
	}

	onFileSelected($event: Event) {
		const input = $event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			this.selectedFile = file;
		}
	}

	upload() {
		if (this.form.invalid || !this.gallery) {
			console.error('Formulaire invalide ou galerie non définie');
			return;
		}

		this.isUploading = true;
		this.uploadProgress = 0;

		this.galleryService.uploadGallery(this.gallery.id!, this.form.value.author, this.selectedFile!).subscribe({
			next: (event) => {
				if (event.type === HttpEventType.UploadProgress && event.total) {
					this.uploadProgress = Math.round((100 * event.loaded) / event.total);
				} else if (event.type === HttpEventType.Response) {
					this.uploaded.emit(event.body?.gallery);
					this.close.emit();
				}
			},
			error: (err) => {
				console.error('Erreur lors de l’envoi :', err);
				this.isUploading = false;
			}
		});
	}

	getZipSizeInMB(file: File | null): string {
		if (!file) return '0 MB';
		const sizeInMB = file.size / (1024 * 1024);

		return `${sizeInMB.toFixed(1)} MB`
	}

}
