import {Game} from './game';
import {Achievement} from './achievement';
import {Heroe} from './heroe';
import {SupportedLang} from '@/app/model/supportedLang';

export interface Member {
	id?: string;
	pseudo: string;
	lastname: string;
	firstname: string;
	nationality: string;
	age?: number;
	dateOfBirth: string;
	role: MemberRole,
	isSubstitute: boolean;
	isActive?: boolean;
	imageKey?: string;
	twitterUsername: string;
	instagramUsername: string;
	tiktokUsername: string;
	youtubeUsername: string;
	twitchUsername: string;
	game: Game;
	achievements?: Achievement[];
	favoriteHeroes: Heroe[];
	translations: Record<SupportedLang, MemberTranslation>;
}

export enum MemberRole {
	DAMAGE = 'DAMAGE',
	TANK = 'TANK',
	SUPPORT = 'SUPPORT',
	VANGUARD = "VANGUARD",
	STRATEGIST = "STRATEGIST",
	DUELIST = "DUELIST",
	COACH = 'COACH',
	TEAM_MANAGER = 'TEAM_MANAGER',
}

export interface MemberTranslation {
	description: string
}

export interface MemberPayload {
	member: Member;
	image: File;
}
