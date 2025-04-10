import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output
} from '@angular/core';
import {ArticleService} from '../../../service/article.service';
import {ToastService} from '../../../service/toast.service';
import {environment} from '../../../../environment/environment';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Article} from '../../../model/article/article';
import {enumKeysObject} from '../../../core/utils/enum';
import {ArticleType} from '../../../model/article/articleType';
import {EditorComponent} from '@tinymce/tinymce-angular';

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
		title: new FormControl(Validators.required),
		content: new FormControl(null, [Validators.required]),
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
				title: this.article.title,
				content: this.article.content,
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
		if(this.article){
			this.update();
		}else{
			this.save();
		}
	}

	save() {
		if(this.articleForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}
		const saveData = { ...this.articleForm.value };
		delete saveData.imageThumbnail;
		delete saveData.imageBackground;

		this.articleService.saveArticle(saveData, this.selectedFileThumbnail!, this.selectedFileBackground!).subscribe({
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

		delete updateData.imageThumbnail;
		delete updateData.imageBackground;
		updateData.imageThumbnail = this.article!.thumbnailImageKey;
		updateData.imageBackground = this.article!.imageKey;
		updateData.createdAt = this.article?.createdAt

		this.articleService.updateArticle(updateData, this.selectedFileThumbnail!, this.selectedFileBackground!).subscribe({
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

			if(this.checkSize(file)) {
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

	checkSize(file: File): boolean {
		if(file.size > 5 * 1024 * 1024) {
			this.toastService.show('L\'image ne doit pas dépasser 5 Mo', 'error');
			return false;
		}
		return true;
	}

	handleUploadFile(imageType: string) {
		const fileInput = document.getElementById(imageType) as HTMLInputElement;
		fileInput.click();
	}

}
