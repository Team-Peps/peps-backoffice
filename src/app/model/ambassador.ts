import {SupportedLang} from '@/app/model/supportedLang';

export interface Ambassador {
	id?: string;
	name: string;
	translations: Record<SupportedLang, AmbassadorTranslation>;
	imageKey?: string;
	twitterXUsername: string;
	instagramUsername: string;
	tiktokUsername: string;
	youtubeUsername: string;
	twitchUsername: string;
}

export interface AmbassadorTranslation {
	description: string;
}

export interface AmbassadorPayload {
	ambassador: Ambassador;
	image: File;
}
