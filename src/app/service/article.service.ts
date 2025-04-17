import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Article} from '../model/article/article';
import {environment} from '@/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ArticleService {

	constructor(
		private http: HttpClient
	) {}

	getAllArticles(): Observable<Article[]> {
		return this.http.get<Article[]>(`${environment.backendUrl}/article/all`);
	}

	updateArticle(article: Article, imageFileThumbnail: File, imageFileBackground: File): Observable<{ message: string, article: Article}> {
		const formData = new FormData();
		formData.append('article', new Blob([JSON.stringify(article)], { type: 'application/json' }));
		formData.append('imageFileThumbnail', imageFileThumbnail);
		formData.append('imageFileBackground', imageFileBackground);

		return this.http.put<{ message: string, article: Article}>(`${environment.backendUrl}/article`, formData);
	}

	saveArticle(article: Article, imageFileThumbnail: File, imageFileBackground: File): Observable<{ message: string, article: Article}> {
		const formData = new FormData();
		formData.append('article', new Blob([JSON.stringify(article)], { type: 'application/json' }));
		formData.append('imageFileThumbnail', imageFileThumbnail);
		formData.append('imageFileBackground', imageFileBackground);

		return this.http.post<{ message: string, article: Article}>(`${environment.backendUrl}/article`, formData);
	}

	deleteArticle(id: string): Observable<any> {
		return this.http.delete(`${environment.backendUrl}/article/${id}`);
	}
}
