import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output
} from '@angular/core';
import {ArticleService} from '@/app/service/article.service';
import {ToastService} from '@/app/service/toast.service';
import {environment} from '@/environments/environment';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Article, ArticlePayload, ArticleType} from '@/app/model/article';
import {enumKeysObject} from '@/app/core/utils/enum';
import {EditorComponent} from '@tinymce/tinymce-angular';
import {ImageService} from '@/app/service/image.service';

@Component({
	selector: 'app-update-article',
	imports: [
		ReactiveFormsModule,
		EditorComponent,
	],
	templateUrl: './update-article.component.html',
})
export class UpdateArticleComponent implements OnChanges {

	constructor(
		private readonly articleService: ArticleService,
		private readonly toastService: ToastService,
		private readonly cdr: ChangeDetectorRef,
		protected readonly imageService: ImageService,
	) {}

	ngOnChanges(): void {
		this.initForm();
    }

	protected readonly enumKeysObject = enumKeysObject;
	protected readonly ArticleType = ArticleType;

	minioBaseUrl = environment.minioBaseUrl;
	tinyMCEApiKey = environment.tinyMCEApiKey;

	init: EditorComponent['init'] = {
		plugins: [
			'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
		],
		toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
	}

	articleForm: FormGroup = new FormGroup({
		titleFr: new FormControl(Validators.required),
		titleEn: new FormControl(Validators.required),

		contentFr: new FormControl(null, [Validators.required]),
		contentEn: new FormControl(null, [Validators.required]),

		imageThumbnail: new FormControl(),
		imageBackground: new FormControl(),
		articleType: new FormControl(Validators.required),
	});

	@Input() article: Article | null = null;
	@Output() articleUpdated: EventEmitter<Article | null> = new EventEmitter();

	selectedFileThumbnail: File | null = null;
	selectedFileBackground: File | null = null;

	imagePreviewThumbnail: string | null = null;
	imagePreviewBackground: string | null = null;

	initForm(): void {
		if (this.article) {
			this.articleForm.patchValue({
				titleFr: this.article.translations.en.title,
				titleEn: this.article.translations.fr.title,
				contentFr: this.article.translations.fr.content,
				contentEn: this.article.translations.en.content,
				articleType: this.article.articleType,
			});

			this.imagePreviewThumbnail = this.minioBaseUrl + this.article.thumbnailImageKey;
			this.imagePreviewBackground = this.minioBaseUrl + this.article.imageKey;
		}else{
			this.articleForm.reset();
			this.imagePreviewThumbnail = null;
			this.imagePreviewBackground = null;
		}
		this.cdr.detectChanges();
	}

	saveOrUpdateArticle(): void {
		if(this.articleForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}

		if(this.article){
			this.update();
		}else{
			this.save();
		}
	}

	save() {

		const {articleType, titleFr, titleEn, contentFr, contentEn} = this.articleForm.value;

		const article: Article = {
			articleType,
			translations: {
				fr: {
					title: titleFr,
					content: contentFr,
				},
				en: {
					title: titleEn,
					content: contentEn,
				}
			}
		};

		const payload: ArticlePayload = {
			article,
			files: {
				thumbnailImage: this.selectedFileThumbnail!,
				image: this.selectedFileBackground!
			}
		}

		this.articleService.saveArticle(payload).subscribe({
			next: (response) => {
				this.articleUpdated.emit();
				this.articleForm.reset();
				this.imagePreviewBackground = "";
				this.imagePreviewThumbnail = "";
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	update(){
		const updateData = { ...this.articleForm.value, id: this.article!.id };
		const {articleType, titleFr, titleEn, contentFr, contentEn} = this.articleForm.value;

		const article: Article = {
			id: this.article!.id,
			articleType,
			translations: {
				fr: {
					title: titleFr,
					content: contentFr,
				},
				en: {
					title: titleEn,
					content: contentEn,
				}
			}
		}

		const payload: ArticlePayload = {
			article,
			files: {
				thumbnailImage: this.selectedFileThumbnail!,
				image: this.selectedFileBackground!
			}
		}

		this.articleService.updateArticle(payload).subscribe({
			next: (response) => {
				this.articleUpdated.emit();
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	async onFileSelected(event: Event, typeImg: string): Promise<void> {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];

			if(this.imageService.checkSize(file) && this.imageService.checkFormat(file)) {
				if(typeImg === 'thumbnail') {

					this.selectedFileThumbnail = file;
					const reader = new FileReader();
					reader.onload = () => {
						this.imagePreviewThumbnail = reader.result as string;
					};
					reader.readAsDataURL(file!);
				} else {
					this.selectedFileBackground = file;
					const reader = new FileReader();
					reader.onload = () => {
						this.imagePreviewBackground = reader.result as string;
					};
					reader.readAsDataURL(file!);
				}
				this.toastService.show('Nouvelle image chargée', 'success');

			}else{
				input.value = "";
			}
		}
	}

	handleUploadFile(imageType: string) {
		const fileInput = document.getElementById(imageType) as HTMLInputElement;
		fileInput.click();
	}

}
