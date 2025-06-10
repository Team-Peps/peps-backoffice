import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Video} from '@/app/model/video';
import {environment} from '@/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class VideoService {

	constructor(
		private readonly http: HttpClient
	) {}

	getAllVideos(): Observable<Video[]> {
		return this.http.get<Video[]>(`${environment.backendUrl}/last-videos`);
	}

	createVideo(video: Video, imageFile: File): Observable<{ message: string; video: Video }> {
		const formData = new FormData();
		formData.append('video', new Blob([JSON.stringify(video)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);

		return this.http.post<{ message: string; video: Video }>(`${environment.backendUrl}/last-videos`, formData);
	}

	updateVideo(video: Video, imageFile: File): Observable<{ message: string; video: Video }> {
		const formData = new FormData();
		formData.append('video', new Blob([JSON.stringify(video)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);

		return this.http.put<{ message: string; video: Video }>(`${environment.backendUrl}/last-videos`, formData);
	}
}
