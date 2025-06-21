import {GalleryPhoto} from '@/app/model/galleryPhoto';
import {SupportedLang} from '@/app/model/supportedLang';

export interface Gallery {
	id?: string;
	date: string;
	photos?: GalleryPhoto[];
	authors?: string[];
	thumbnailImageKey?: string;
	translations: Record<SupportedLang, GalleryTranslation>;
}

export interface GalleryTranslation {
	eventName: string;
	description: string;
}

export interface GalleryPayload {
	gallery: Gallery;
	image: File;
}
