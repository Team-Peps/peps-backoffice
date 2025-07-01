import {SupportedLang} from '@/app/model/supportedLang';

export interface Slider {
	id?: string;
	isActive: boolean;
	ctaLink: string;
	order?: number;
	translations: Record<SupportedLang, SliderTranslation>
}

export interface SliderTranslation {
	ctaLabel: string;
	imageKey: string;
	mobileImageKey: string;
}

export interface SliderPayload {
	slider: Slider;
	files: {
		fr: {
			image: File;
			mobileImage: File;
		},
		en: {
			image: File;
			mobileImage: File;
		}
	}
}
