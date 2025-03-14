import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Roster} from '../../../model/roster';
import {ToastService} from '../../../service/toast.service';
import {RosterService} from '../../../service/roster.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-update-roster',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		NgClass
	],
  templateUrl: './update-roster.component.html',
})
export class UpdateRosterComponent implements OnInit, OnChanges {

	constructor(
		private toastService: ToastService,
		private rosterService: RosterService,
		private cdr: ChangeDetectorRef,
	) {
	}

	rosterForm: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		game: new FormControl('overwatch', Validators.required),
		isOpponent: new FormControl(true, Validators.required),
		image: new FormControl()
	});

	@Input() roster: Roster | null = null;
	@Output() rosterSaved = new EventEmitter();
	@Output() cancel = new EventEmitter();

	isButtonDisabled: boolean = false;

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	ngOnInit(){
		this.initForm();
	}

	ngOnChanges() {
		this.initForm();
	}

	initForm() {
		if (this.roster) {
			this.rosterForm.patchValue({
				name: this.roster.name,
				game: this.roster.game,
				isOpponent: this.roster.isOpponent,
				image: null
			});

			this.imagePreview = "data:image/webp;base64," + this.roster.image;
		}else{
			this.rosterForm.reset();
			this.rosterForm.patchValue({isoOpponent: true, game: 'overwatch'});
			this.imagePreview = "";
		}
		this.cdr.detectChanges();
	}

	save(){
		if(this.roster){
			this.updateRoster();
		}else{
			this.createRoster();
		}
	}

	createRoster() {
		if (this.rosterForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		let roster = { ...this.rosterForm.value };
		delete roster.image;
		this.isButtonDisabled = true;

		this.rosterService.createRoster(roster, this.selectedFile!).subscribe({
			next: () => {
				this.toastService.show('Equipe adverse créé avec succès', 'success');
				this.rosterForm.get('name')!.setValue('');
				this.rosterForm.markAsPristine();
				this.rosterSaved.emit();
				this.isButtonDisabled = false;
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
				this.isButtonDisabled = false;
			}
		});
	}

	updateRoster() {

		let updatedRoster = { ...this.roster, ...this.rosterForm.value };
		delete updatedRoster.image;
		this.isButtonDisabled = true;

		this.rosterService.updateRoster(updatedRoster, this.selectedFile!).subscribe({
			next: () => {
				this.toastService.show('Equipe adverse mise à jour avec succès', 'success');
				this.rosterForm.get('name')!.setValue('');
				this.rosterForm.markAsPristine();
				this.rosterSaved.emit();
				this.isButtonDisabled = false;
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
				this.isButtonDisabled = false;
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

	cancelAddOrEditRoster() {
		this.cancel.emit();
	}
}
