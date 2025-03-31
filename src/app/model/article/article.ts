import {ArticleType} from './articleType';

export interface Article {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	imageKey: string;
	articleType: ArticleType;
}
