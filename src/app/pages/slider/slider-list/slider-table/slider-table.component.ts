import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Slider} from '../../../../model/slider';
import {NgOptimizedImage} from '@angular/common';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {environment} from '@/environments/environment';

@Component({
  selector: 'slider-table',
	imports: [
		NgOptimizedImage,
		CdkDrag,
		CdkDropList
	],
  templateUrl: './slider-table.component.html',
})
export class SliderTableComponent {

	@Input() sliders: Slider[] = [];

	@Output() sliderToUpdate: EventEmitter<Slider> = new EventEmitter();
	@Output() sliderToActive: EventEmitter<Slider> = new EventEmitter();
	@Output() sliderToDelete: EventEmitter<Slider> = new EventEmitter();
	@Output() orderChanged: EventEmitter<string[]> = new EventEmitter();

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

	drop($event: CdkDragDrop<Slider[]>) {
		moveItemInArray(this.sliders, $event.previousIndex, $event.currentIndex);
		const newOrder = this.sliders.map(slider => slider.id);
		this.orderChanged.emit(newOrder);
	}
}
