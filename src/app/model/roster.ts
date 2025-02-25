import {Game} from './game';
import {Members} from './members';

export interface Roster {
	id: string;
	name: string;
	game: Game;
	members: Members[];
}
