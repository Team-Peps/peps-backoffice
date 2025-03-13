import {Member} from './member/member';

export interface Roster {
	id?: string;
	name: string;
	game: string;
	members?: Member[];
	matchCount?: number;
}
