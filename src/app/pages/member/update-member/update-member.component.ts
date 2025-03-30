import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges, OnInit, Output
} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {getNationalityName, Nationality} from '../../../model/nationality';
import {enumKeysObject} from '../../../core/utils/enum';
import {MemberService} from '../../../service/member.service';
import {ToastService} from '../../../service/toast.service';
import {MemberRole} from '../../../model/member/memberRole';
import {environment} from '../../../../environment/environment';
import {Member} from '../../../model/member/member';

@Component({
  selector: 'app-update-member',
	imports: [
		ReactiveFormsModule,

	],
  templateUrl: './update-member.component.html',
})
export class UpdateMemberComponent implements OnInit, OnChanges {

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly memberService: MemberService,
		private readonly toastService: ToastService,
	) {}

	ngOnInit(): void {

    }

	minioBaseUrl = environment.minioBaseUrl;

	memberForm: FormGroup = new FormGroup({
		pseudo: new FormControl(Validators.required),
		lastname: new FormControl(Validators.required),
		firstname: new FormControl(Validators.required),
		nationality: new FormControl(Validators.required),
		dateOfBirth: new FormControl(Validators.required),
		role: new FormControl(Validators.required),
		image: new FormControl(),
		description: new FormControl(),

		xUsername: new FormControl(Validators.required),
		instagramUsername: new FormControl(Validators.required),
		tiktokUsername: new FormControl(Validators.required),
		twitchUsername: new FormControl(Validators.required),
		youtubeUsername: new FormControl(Validators.required),

		isSubstitute: new FormControl(),

	})

	protected readonly Nationality = Nationality;
	protected readonly enumKeysObject = enumKeysObject;
	protected readonly getNationalityName = getNationalityName;
	protected readonly Role = MemberRole;

	@Input() member: Member | null = null;
	@Input() countMembers!: number;

	@Output() memberSaved = new EventEmitter();

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	ngOnChanges() {
		this.initForm();
	}

	initForm() {
		if (this.member) {
			console.log(this.member.xusername)
			this.memberForm.setValue({
				pseudo: this.member.pseudo,
				lastname: this.member.lastname,
				firstname: this.member.firstname,
				nationality: this.member.nationality,
				dateOfBirth: new Date(this.member.dateOfBirth).toISOString().substring(0, 10),
				role: this.member.role,
				image: null,
				description: this.member.description,

				xUsername: this.member.xusername,
				instagramUsername: this.member.instagramUsername,
				tiktokUsername: this.member.tiktokUsername,
				twitchUsername: this.member.twitchUsername,
				youtubeUsername: this.member.youtubeUsername,

				isSubstitute: this.member.isSubstitute,
			});

			this.imagePreview = this.minioBaseUrl + this.member.imageKey;
		}else{
			this.memberForm.reset();
			this.imagePreview = "";
		}
		this.cdr.detectChanges();
	}

	saveOrUpdate(){
		if(this.member) {
			this.update();
		}else{
			this.save();
		}
	}

	save(){
		if (this.memberForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}
		const saveData = { ...this.memberForm.value };
		delete saveData.image;

		console.log(saveData);
		this.memberService.saveMember(saveData, this.selectedFile!).subscribe({
			next: (response) => {
				this.memberSaved.emit();
				this.memberForm.reset();
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
		const updateData = { ...this.memberForm.value, id: this.member!.id };

		delete updateData.image;
		updateData.imageKey = this.member!.imageKey;

		this.memberService.updateMember(updateData, this.selectedFile!).subscribe({
			next: (response) => {
				this.memberSaved.emit();
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

	tttt() {
		console.log(this.memberForm)
	}
}
