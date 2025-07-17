import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges, OnInit, Output
} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {nationalities} from '@/app/model/nationality';
import {MemberService} from '@/app/service/member.service';
import {ToastService} from '@/app/service/toast.service';
import {environment} from '@/environments/environment';
import {Member, MemberPayload, MemberRole} from '@/app/model/member';
import {Game} from '@/app/model/game';
import {HeroSelectorComponent} from './hero-selector/hero-selector.component';
import {Heroe} from '@/app/model/heroe';
import {HeroeService} from '@/app/service/heroe.service';
import {ImageService} from '@/app/service/image.service';
import {enumKeysObject} from '@/app/core/utils/enum';

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

		twitterUsername: new FormControl(''),
		instagramUsername: new FormControl(''),
		tiktokUsername: new FormControl(''),
		twitchUsername: new FormControl(''),
		youtubeUsername: new FormControl(''),

		isSubstitute: new FormControl(false),
		game: new FormControl('', Validators.required),
		favoriteHeroes: new FormControl([], [Validators.maxLength(3)]),

		descriptionFr: new FormControl('', Validators.required),
		descriptionEn: new FormControl('', Validators.required),
	})

	protected readonly Role = MemberRole;
	protected readonly Game = Game;
	protected readonly nationalities = nationalities;
	protected readonly enumKeysObject = enumKeysObject;

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

				descriptionFr: this.member.translations.fr.description,
				descriptionEn: this.member.translations.en.description,

				twitterUsername: this.member.twitterUsername,
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
		if (this.memberForm.invalid || (this.memberForm.get('role')?.value != 'COACH' && this.memberForm.get('isSubstitute')?.value === null)) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		if(this.member) {
			this.update();
		}else{
			this.save();
		}
	}

	save(){
		const {pseudo, lastname, firstname, dateOfBirth, nationality, role, twitterUsername, instagramUsername, tiktokUsername, twitchUsername, youtubeUsername, isSubstitute, game, favoriteHeroes, descriptionFr, descriptionEn} = this.memberForm.value;

		const member: Member = {
			pseudo,
			lastname,
			firstname,
			nationality,
			dateOfBirth,
			role,
			twitterUsername,
			instagramUsername,
			tiktokUsername,
			twitchUsername,
			youtubeUsername,
			isSubstitute,
			game,
			favoriteHeroes: favoriteHeroes || [],
			translations: {
				fr: {
					description: descriptionFr
				},
				en: {
					description: descriptionEn
				}
			}
		}

		const payload: MemberPayload = {
			member,
			image: this.selectedFile!
		}

		this.memberService.saveMember(payload).subscribe({
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
		const {pseudo, lastname, firstname, dateOfBirth, nationality, role, twitterUsername, instagramUsername, tiktokUsername, twitchUsername, youtubeUsername, isSubstitute, game, favoriteHeroes, descriptionFr, descriptionEn} = this.memberForm.value;

		const member: Member = {
			id: this.member!.id,
			pseudo,
			lastname,
			firstname,
			nationality,
			dateOfBirth,
			role,
			twitterUsername,
			instagramUsername,
			tiktokUsername,
			twitchUsername,
			youtubeUsername,
			isSubstitute,
			game,
			favoriteHeroes: favoriteHeroes || [],
			translations: {
				fr: {
					description: descriptionFr
				},
				en: {
					description: descriptionEn
				}
			}
		}

		const payload: MemberPayload = {
			member,
			image: this.selectedFile!
		}

		this.memberService.updateMember(payload).subscribe({
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
