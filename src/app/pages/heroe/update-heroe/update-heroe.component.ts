import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {HeroeService} from '../../../service/heroe.service';
import {ToastService} from '../../../service/toast.service';
import {environment} from '../../../../environment/environment';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Heroe, MarvelRivalsHeroRole, OverwatchHeroRole} from '../../../model/heroe';
import {enumKeysObject} from '../../../core/utils/enum';
import {Game} from '../../../model/game';

@Component({
  selector: 'app-update-heroe',
	imports: [
		FormsModule,
		ReactiveFormsModule
	],
  templateUrl: './update-heroe.component.html',
})
export class UpdateHeroeComponent implements OnChanges {

	constructor(
		private readonly heroeService: HeroeService,
		private readonly toastService: ToastService,
		private readonly cdr: ChangeDetectorRef,
	) {}

    ngOnChanges(): void {
		this.initForm();
    }

	protected readonly enumKeysObject = enumKeysObject;
	protected readonly Game = Game;
	protected readonly OverwatchHeroRole = OverwatchHeroRole;
	protected readonly MarvelRivalsHeroRole = MarvelRivalsHeroRole;

	minioBaseUrl = environment.minioBaseUrl;

	heroeForm: FormGroup = new FormGroup({
		name: new FormControl(Validators.required),
		role: new FormControl(Validators.required),
		image: new FormControl(),
		game: new FormControl(Validators.required),
	});

	@Input() heroe: Heroe | null = null;

	@Output() heroeUpdated: EventEmitter<Heroe | null> = new EventEmitter();

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	initForm(): void {
		if (this.heroe) {
			this.heroeForm.patchValue({
				name: this.heroe.name,
				game: this.heroe.game,
				role: this.heroe.role,
			});

			this.imagePreview = this.minioBaseUrl + this.heroe.imageKey;
		}else{
			this.heroeForm.reset();
			this.imagePreview = null;
		}
		this.cdr.detectChanges();
	}

	saveOrUpdateHeroe(): void {
		if(this.heroe){
			this.update();
		}else{
			this.save();
		}
	}

	save() {
		if(this.heroeForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}
		const saveData = { ...this.heroeForm.value };
		delete saveData.image;

		this.heroeService.saveHeroe(saveData, this.selectedFile!).subscribe({
			next: (response) => {
				this.heroeUpdated.emit();
				this.heroeForm.reset();
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
		const updateData = { ...this.heroeForm.value, id: this.heroe!.id };

		delete updateData.image;
		updateData.imageKey = this.heroe!.imageKey;

		this.heroeService.updateHeroe(updateData, this.selectedFile!).subscribe({
			next: (response) => {
				this.heroeUpdated.emit();
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
