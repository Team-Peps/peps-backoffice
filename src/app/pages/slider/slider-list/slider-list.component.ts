import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SliderService} from '../../../service/slider.service';
import {ToastService} from '../../../service/toast.service';
import {environment} from '@/environments/environment';
import {Slider} from '../../../model/slider';
import {SliderTableComponent} from './slider-table/slider-table.component';
import {UpdateSliderComponent} from '../update-slider/update-slider.component';

@Component({
  selector: 'app-slider-list',
	imports: [
		SliderTableComponent,
		UpdateSliderComponent
	],
  templateUrl: './slider-list.component.html',
})
export class SliderListComponent implements OnInit {

	constructor(
		private readonly sliderService: SliderService,
		private readonly cdr: ChangeDetectorRef,
		private readonly toastService: ToastService
	) {}

	minioBaseUrl = environment.minioBaseUrl;

	activeSliders: Slider[] = [];
	inactiveSliders: Slider[] = [];

	selectedSlider : Slider | null = null;

	isCreateSlider: boolean = false;

	ngOnInit(): void {
		this.loadSliders();
	}

	loadSliders(): void {
		this.sliderService.getAllSlider().subscribe(response => {
			this.activeSliders = response["activeSliders"];
			this.inactiveSliders = response["inactiveSliders"];
		});
	}

	toggleCreateSlider() {
		this.isCreateSlider = !this.isCreateSlider;
		this.selectedSlider = null;
		this.cdr.detectChanges();
	}

	toggleActive(slider: Slider) {
		this.sliderService.toggleActive(slider.id).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.loadSliders();
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
			}
		})
	}

	deleteSlider(slider: Slider) {
		this.sliderService.deleteSlider(slider.id).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.loadSliders();
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
			}
		})
	}

	selectSlider(slider: Slider) {
		this.selectedSlider = slider;
		this.isCreateSlider = false;
		this.cdr.detectChanges();
		document.getElementById('updateSlider')?.scrollIntoView({behavior: 'smooth'});
	}

	onOrderChanged(newOrder: string[]) {
		this.sliderService.updateOrder(newOrder).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.loadSliders();
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
			}
		})
	}
}
