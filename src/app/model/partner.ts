import {SupportedLang} from '@/app/model/supportedLang';

export interface Partner {
	id?: string;
	name: string;
	imageKey?: string;
	link: string;
	codes: PartnerCode[];
	isActive: boolean;
	order: number;
	type: 'MINOR' | 'MAJOR';
	translations: Record<SupportedLang, PartnerTranslation>;
}

export interface PartnerCode {
	code: string;
	descriptionFr: string;
	descriptionEn: string;
}

export interface PartnerTranslation {
	description: string;
}

export interface PartnerPayload {
	partner: Partner;
	image: File;
}

export interface PartnerCode {
	code: string;
	description: string;
}
