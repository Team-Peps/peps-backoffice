import {Member} from './member';

export interface Roster {
	id?: string;
	name: string;
	game: string;
	isOpponent: boolean;
	members?: Member[];
	matchCount?: number;
	imageKey?: string;
}

export interface RosterTiny {
	id: string;
	name: string;
	game: string;
}
