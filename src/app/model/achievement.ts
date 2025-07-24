import {Game} from './game';

export interface Achievement {
	id: string;
	competitionName: string;
	ranking: number;
	year: number;
	game: Game;
}
