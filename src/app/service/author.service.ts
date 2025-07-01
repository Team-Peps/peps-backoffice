import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Author} from '@/app/model/author';
import {environment} from '@/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthorService {

	constructor(
		private http: HttpClient
	) {}

	getAllAuthors() {
		return this.http.get<Author[]>(`${environment.backendUrl}/author`);
	}

	createAuthor(author: Author) {
		return this.http.post<{ message: string; author: Author }>(`${environment.backendUrl}/author`, author);
	}

	updateAuthor(author: Author) {
		return this.http.put<{ message: string; author: Author }>(`${environment.backendUrl}/author/${author.id}`, author);
	}
}
