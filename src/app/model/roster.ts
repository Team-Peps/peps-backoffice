import {Game} from './game';
import {Member} from './member/member';

export interface Roster {
	id: string;
	name: string;
	game: Game;
	members?: Member[];
}
