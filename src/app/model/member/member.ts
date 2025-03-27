import {MemberRole} from './memberRole';

export interface Member {
	id: string;
	pseudo: string;
	lastname: string;
	firstname: string;
	age: number;
	nationality: string;
	role: MemberRole,
	roster?: string;
}

export interface PepsMember extends Member {
	dpi?: number;
	dateOfBirth: string;
	imageKey: string;
}

export interface OpponentMember extends Member {

}

export interface MemberTiny{
	id: string;
	pseudo: string;
}


