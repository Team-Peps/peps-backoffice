import {SupportedLang} from '@/app/model/supportedLang';

export interface Article {
	id?: string;
	createdAt?: Date;
	thumbnailImageKey?: string;
	imageKey?: string;
	articleType: ArticleType;
	translations: Record<SupportedLang, ArticleTranslation>;
}

export enum ArticleType {
	OVERWATCH = "OVERWATCH",
	MARVEL_RIVALS = "MARVEL_RIVALS",
	TEAM_PEPS = "TEAM_PEPS",
}

export interface ArticleTranslation {
	title: string;
	content: string;
}

export interface ArticlePayload {
	article: Article;
	files: {
		thumbnailImage: File;
		image: File;
	}
}
