import {Role} from './role';

export interface Member {
	id: string;
	pseudo: string;
	lastname: string;
	firstname: string;
	dateOfBirth: string;
	age: number;
	nationality: string;
	role: Role,
	dpi?: number;
	roster?: string;
}



