import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ToastService} from '@/app/service/toast.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Author} from '@/app/model/author';
import {AuthorService} from '@/app/service/author.service';
import {handleError} from '@/app/service/handleError';

@Component({
	selector: 'app-author-update',
	imports: [
		FormsModule,
		ReactiveFormsModule
	],
	templateUrl: './author-update.component.html',
})
export class AuthorUpdateComponent implements OnChanges {

	constructor(
		private readonly toastService: ToastService,
		private readonly authorService: AuthorService,
		private readonly cdr: ChangeDetectorRef,
	) {}

	ngOnChanges(): void {
		this.initForm();
	}

	authorForm: FormGroup = new FormGroup({
		name: new FormControl('', [Validators.required])
	});

	@Input() author: Author | null = null;
	@Output() authorUpdated: EventEmitter<Author | null> = new EventEmitter();

	initForm() {
		if(this.author) {
			this.authorForm.patchValue({
				name: this.author.name,
			});
		} else {
			this.authorForm.reset();
		}
		this.cdr.detectChanges();
	}

	saveOrUpdate() {
		if(this.author) {
			this.update();
		} else {
			this.save();
		}
	}

	save() {
		if(this.authorForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		this.authorService.createAuthor(this.authorForm.value).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.authorUpdated.emit();
			},
			error: (err) => {
				console.error("❌ Erreur lors de la sauvegarde :", err);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	update() {
		if(this.authorForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		const updateData = { ...this.authorForm.value, id: this.author!.id };

		this.authorService.updateAuthor(updateData).subscribe({
			next: (res) => {
				this.toastService.show('Auteur mis à jour avec succès', 'success');
				this.authorUpdated.emit();
			},
			error: (err) => {
				console.error("❌ Erreur lors de la sauvegarde :", err);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}
}
