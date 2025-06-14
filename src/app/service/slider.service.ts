import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Slider, SliderPayload} from '../model/slider';
import {environment} from '@/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class SliderService {

	constructor(
		private http: HttpClient
	) {}

	getAllSlider(): Observable<Record<string, Slider[]>> {
		return this.http.get<Record<string, Slider[]>>(`${environment.backendUrl}/slider`);
	}

	createSlider(payload: SliderPayload): Observable<{ message: string; slider: Slider }> {

		const formData = new FormData();
		formData.append('slider', new Blob([JSON.stringify(payload.slider)], { type: 'application/json' }));
		formData.append('imageFileFr', payload.files.fr.image);
		formData.append('imageFileEn', payload.files.en.image);
		formData.append('mobileImageFileFr', payload.files.fr.mobileImage);
		formData.append('mobileImageFileEn', payload.files.en.mobileImage);

		return this.http.post<{ message: string; slider: Slider }>(`${environment.backendUrl}/slider`, formData);
	}

	updateSlider(payload: SliderPayload): Observable<{ message: string, slider: Slider}> {

		const formData = new FormData();
		formData.append('slider', new Blob([JSON.stringify(payload.slider)], { type: 'application/json' }));
		formData.append('imageFileFr', payload.files.fr.image);
		formData.append('imageFileEn', payload.files.en.image);
		formData.append('mobileImageFileFr', payload.files.fr.mobileImage);
		formData.append('mobileImageFileEn', payload.files.en.mobileImage);

		return this.http.put<{ message: string, slider: Slider}>(`${environment.backendUrl}/slider`, formData);
	}

	deleteSlider(id: string): Observable<any> {
		return this.http.delete(`${environment.backendUrl}/slider/${id}`);
	}

	toggleActive(id: string): Observable<any> {
		return this.http.post(`${environment.backendUrl}/slider/${id}/active`, {});
	}

	updateOrder(orderedIds: string[]): Observable<any> {
		return this.http.put(`${environment.backendUrl}/slider/reorder`, orderedIds);
	}

}
