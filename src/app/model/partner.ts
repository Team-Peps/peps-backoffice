export interface Partner {
	id: string;
	name: string;
	description: string;
	imageKey: string;
	link: string;
	codes: PartnerCode[];
	isActive: boolean;
	order: number;
	type: 'MINOR' | 'MAJOR';
}

export interface PartnerCode {
	code: string;
	description: string;
}
