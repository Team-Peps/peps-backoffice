import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@/environments/environment';
import {Gallery, GalleryPayload} from '@/app/model/gallery';

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

	createGallery(payload: GalleryPayload): Observable<{ message: string; gallery: Gallery }> {

		const formData = new FormData();
		formData.append('gallery', new Blob([JSON.stringify(payload.gallery)], {type: 'application/json'}));
		formData.append('imageFile', payload.image);

		return this.http.post<{ message: string; gallery: Gallery }>(`${environment.backendUrl}/gallery`, formData);
	}

	deleteGallery(id: string) {
		return this.http.delete<{ message: string }>(`${environment.backendUrl}/gallery/${id}`);
	}

	updateGallery(payload: GalleryPayload): Observable<{ message: string; gallery: Gallery }> {

		const formData = new FormData();
		formData.append('gallery', new Blob([JSON.stringify(payload.gallery)], {type: 'application/json'}));
		formData.append('imageFile', payload.image);

		return this.http.put<{ message: string; gallery: Gallery }>(`${environment.backendUrl}/gallery/${payload.gallery.id}`, formData);
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
