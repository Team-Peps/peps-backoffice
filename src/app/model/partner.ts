export interface Partner {
	id: string;
	name: string;
	description: string;
	imageKey: string;
	link: string;
	codes: string[];
	isActive: boolean;
	order: number;
	type: 'MINOR' | 'MAJOR';
}
