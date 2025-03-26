import {Member} from './member/member';

export interface Roster {
	id?: string;
	name: string;
	game: string;
	isOpponent: boolean;
	members?: Member[];
	matchCount?: number;
	image?: string;
}

export interface RosterTiny {
	id: string;
	name: string;
	game: string;
}
