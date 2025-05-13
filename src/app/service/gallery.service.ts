import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@/environments/environment';
import {Gallery} from '@/app/model/gallery';

@Injectable({
	providedIn: 'root'
})
export class GalleryService {

	constructor(
		private http: HttpClient
	) {}

	getAllGalleries(): Observable<Gallery[]> {
		return this.http.get<Gallery[]>(`${environment.backendUrl}/gallery/all`);
	}

	createGallery(gallery: Gallery): Observable<{ message: string; gallery: Gallery }> {
		return this.http.post<{ message: string; gallery: Gallery }>(`${environment.backendUrl}/gallery`, gallery);
	}

	deleteGallery(id: string) {
		return this.http.delete<{ message: string }>(`${environment.backendUrl}/gallery/${id}`);
	}

	updateGallery(galleryId: string, gallery: Gallery): Observable<{ message: string; gallery: Gallery }> {
		return this.http.put<{ message: string; gallery: Gallery }>(`${environment.backendUrl}/gallery/${galleryId}`, gallery);
	}

	deletePhoto(id: string) {
		return this.http.delete<{ message: string }>(`${environment.backendUrl}/gallery/photo/${id}`);
	}

	uploadGallery(id: string, author: string, zipFile: File) {
		const formData = new FormData();
		formData.append('author', author);
		formData.append('zipFile', zipFile);
		return this.http.put<{ message: string; gallery: Gallery }>(`${environment.backendUrl}/gallery/${id}/photos`, formData, {reportProgress: true, observe: 'events'});
	}

}
