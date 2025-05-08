import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastService} from '@/app/service/toast.service';
import {GalleryService} from '@/app/service/gallery.service';
import {Gallery} from '@/app/model/gallery';

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
	) {}

	ngOnChanges(): void {
		this.initForm();
	}

	galleryForm: FormGroup = new FormGroup({
		eventName: new FormControl('', [Validators.required]),
		date: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
	});

	@Input() gallery: Gallery | null = null;
	@Output() galleryUpdated: EventEmitter<Gallery | null> = new EventEmitter();

	initForm() {
		if(this.gallery) {
			this.galleryForm.patchValue({
				eventName: this.gallery.eventName,
				date: this.gallery.date,
				description: this.gallery.description,
			});
		} else {
			this.galleryForm.reset();
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
		this.galleryService.createGallery(saveData).subscribe({
			next: (response) => {
				this.galleryUpdated.emit();
				this.galleryForm.reset();
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
		this.galleryService.updateGallery(this.gallery!.id, updateData).subscribe({
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
}
