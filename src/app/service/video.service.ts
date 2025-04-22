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

	createVideo(video: Video): Observable<{ message: string; video: Video }> {
		return this.http.post<{ message: string; video: Video }>(`${environment.backendUrl}/last-videos`, video);
	}

	updateVideo(video: Video): Observable<{ message: string; video: Video }> {
		return this.http.put<{ message: string; video: Video }>(`${environment.backendUrl}/last-videos`, video);
	}
}
