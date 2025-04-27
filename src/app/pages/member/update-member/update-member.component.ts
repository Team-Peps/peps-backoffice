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
import {environment} from '@/environments/environment';
import {Member} from '../../../model/member/member';
import {Game} from '../../../model/game';
import {HeroSelectorComponent} from './hero-selector/hero-selector.component';
import {Heroe} from '../../../model/heroe';
import {HeroeService} from '../../../service/heroe.service';
import {ImageService} from '@/app/service/image.service';

@Component({
  selector: 'app-update-member',
	imports: [
		ReactiveFormsModule,
		HeroSelectorComponent,

	],
  templateUrl: './update-member.component.html',
})
export class UpdateMemberComponent implements OnChanges, OnInit {

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly memberService: MemberService,
		private readonly toastService: ToastService,
		private readonly heroeService: HeroeService,
		protected readonly imageService: ImageService,
	) {}

	minioBaseUrl = environment.minioBaseUrl;

	memberForm: FormGroup = new FormGroup({
		pseudo: new FormControl('', Validators.required),
		lastname: new FormControl('', Validators.required),
		firstname: new FormControl('', Validators.required),
		nationality: new FormControl('', Validators.required),
		dateOfBirth: new FormControl('', Validators.required),
		role: new FormControl('', Validators.required),
		image: new FormControl(),
		description: new FormControl(),

		xUsername: new FormControl('', Validators.required),
		instagramUsername: new FormControl('', Validators.required),
		tiktokUsername: new FormControl('', Validators.required),
		twitchUsername: new FormControl('', Validators.required),
		youtubeUsername: new FormControl('', Validators.required),

		isSubstitute: new FormControl(),
		game: new FormControl(),
		favoriteHeroes: new FormControl([], [Validators.maxLength(3)])
	})

	protected readonly Nationality = Nationality;
	protected readonly enumKeysObject = enumKeysObject;
	protected readonly getNationalityName = getNationalityName;
	protected readonly Role = MemberRole;
	protected readonly Game = Game;

	@Input() member: Member | null = null;
	@Input() countMembers!: number;

	@Output() memberSaved = new EventEmitter();

	selectedFile: File | null = null;
	imagePreview: string | null = null;

	heroes: Heroe[] = [];

	ngOnInit() {
		this.loadHeroes();
	}

	ngOnChanges() {
		this.initForm();
	}

	initForm() {
		if (this.member) {
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
				game: this.member.game,
				favoriteHeroes: this.member.favoriteHeroes || []
			});

			this.imagePreview = this.minioBaseUrl + this.member.imageKey;
		}else{
			this.memberForm.reset();
			this.imagePreview = "";
		}
		this.cdr.detectChanges();
	}

	loadHeroes() {
		this.heroeService.getAllHeroes().subscribe(heroes => {
			this.heroes = heroes['overwatch'];
			this.heroes = this.heroes.concat(heroes['marvel-rivals']);
			if (this.member) {
				this.memberForm.get('favoriteHeroes')?.setValue(this.member.favoriteHeroes);
			}
		})
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

	filterHeroesByGame(game: string): Heroe[] {
		return this.heroes.filter(hero => hero.game === game);
	}

	async onFileSelected(event: Event): Promise<void> {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];

			if(this.imageService.checkSize(file) && this.imageService.checkFormat(file)) {
				this.selectedFile = file;
				this.toastService.show('Nouvelle image chargée', 'success');

				this.createPreview()
			}else{
				input.value = "";
			}
		}
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
