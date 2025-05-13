import {Author} from '@/app/model/author';

export interface GalleryPhoto {
	id: string;
	imageKey: string;
	author: Author;
}
