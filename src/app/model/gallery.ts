import {GalleryPhoto} from '@/app/model/galleryPhoto';

export interface Gallery {
	id: string;
	eventName: string;
	date: string;
	description: string;
	photos: GalleryPhoto[];
	authors: string[];
	thumbnailImageKey: string;
}
