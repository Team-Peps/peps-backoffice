export interface Slider {
	id: string;
	isActive: boolean;
	imageKey: string;
	mobileImageKey: string;
	ctaLink: string;
	ctaLabel: string;
	order: number;
}

export interface SliderTiny {
	id: string;
	imageKey: string;
	mobileImageKey: string;
	ctaLink: string;
	ctaLabel: string;
}
