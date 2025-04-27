import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ArticleService} from '@/app/service/article.service';
import {ToastService} from '@/app/service/toast.service';
import {Article} from '@/app/model/article/article';
import {ReactiveFormsModule} from '@angular/forms';
import {UpdateArticleComponent} from '../update-article/update-article.component';
import {NgOptimizedImage} from '@angular/common';
import {environment} from '@/environments/environment';

@Component({
  selector: 'app-article-list',
	imports: [
		ReactiveFormsModule,
		UpdateArticleComponent,
		NgOptimizedImage
	],
  templateUrl:  './article-list.component.html',
})
export class ArticleListComponent implements OnInit {

	constructor(
		private readonly articleService: ArticleService,
		private readonly cdr: ChangeDetectorRef,
		private readonly toastService: ToastService
	) {}

	minioBaseUrl = environment.minioBaseUrl;

	articles: Article[] = [];
	selectedArticle: Article | null = null;
	isCreateArticle: boolean = false;

	ngOnInit() {
		this.loadArticles();
	}

	loadArticles(): void {
		this.articleService.getAllArticles().subscribe(articles => {
			this.articles = articles;
			this.cdr.detectChanges();
		});
	}

	selectArticle(article: Article): void {
		this.selectedArticle = article;
		this.isCreateArticle = false;
		this.cdr.detectChanges();
		document.getElementById("updateArticle")?.scrollIntoView({behavior: "smooth"});
	}

	toggleCreateArticle() {
		this.isCreateArticle = !this.isCreateArticle;
		this.selectedArticle = null;
		this.cdr.detectChanges();
	}

	removeArticle(article: Article): void {
		this.articleService.deleteArticle(article.id).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.loadArticles();
			},
			error: (error) => {
				this.toastService.show(error.message, 'error');
			}
		})
	}

}
