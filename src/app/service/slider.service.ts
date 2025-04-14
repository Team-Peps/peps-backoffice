import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Slider, SliderTiny} from '../model/slider';
import {environment} from '../../environment/environment';

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

	getAllActiveSlider(): Observable<SliderTiny[]> {
		return this.http.get<SliderTiny[]>(`${environment.backendUrl}/slider/active`);
	}

	createSlider(slider: Slider, imageFile: File, mobileImageFile: File): Observable<{ message: string; slider: Slider }> {
		const formData = new FormData();
		formData.append('slider', new Blob([JSON.stringify(slider)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);
		formData.append('mobileImageFile', mobileImageFile);

		return this.http.post<{ message: string; slider: Slider }>(`${environment.backendUrl}/slider`, formData);
	}

	updateSlider(slider: Slider, imageFile: File, mobileImageFile: File): Observable<{ message: string, slider: Slider}> {
		const formData = new FormData();
		formData.append('slider', new Blob([JSON.stringify(slider)], { type: 'application/json' }));
		formData.append('imageFile', imageFile);
		formData.append('mobileImageFile', mobileImageFile);

		return this.http.put<{ message: string, slider: Slider}>(`${environment.backendUrl}/slider`, formData);
	}

	deleteSlider(id: string): Observable<any> {
		return this.http.delete(`${environment.backendUrl}/slider/${id}`);
	}

	toggleActive(id: string): Observable<any> {
		return this.http.post(`${environment.backendUrl}/slider/${id}/active`, {});
	}
}
