import {Component, EventEmitter, Input, Output} from '@angular/core';
import {environment} from '../../../../../environment/environment';
import {Slider} from '../../../../model/slider';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'slider-table',
	imports: [
		NgOptimizedImage
	],
  templateUrl: './slider-table.component.html',
})
export class SliderTableComponent {

	@Input() sliders: Slider[] = [];

	@Output() sliderToUpdate: EventEmitter<Slider> = new EventEmitter();
	@Output() sliderToActive: EventEmitter<Slider> = new EventEmitter();
	@Output() sliderToDelete: EventEmitter<Slider> = new EventEmitter();

	minioBaseUrl = environment.minioBaseUrl;

	selectSlider(slider: Slider) {
		this.sliderToUpdate.emit(slider);
	}

	toggleActive(slider: Slider) {
		this.sliderToActive.emit(slider);
	}

	deleteSlider(slider: Slider) {
		this.sliderToDelete.emit(slider);
	}
}
