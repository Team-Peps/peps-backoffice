import {MemberRole} from './memberRole';

export interface Member {
	id: string;
	pseudo: string;
	lastname: string;
	firstname: string;
	description: string;
	nationality: string;
	age: number;
	dateOfBirth: string;
	role: MemberRole,
	isSubstitute: boolean;
	imageKey: string;
	xusername: string;
	instagramUsername: string;
	tiktokUsername: string;
	youtubeUsername: string;
	twitchUsername: string;
}


