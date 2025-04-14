import {MemberRole} from './memberRole';
import {Game} from '../game';
import {Achievement} from '../achievement';

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
	game: Game;
	achievements: Achievement[];
}


