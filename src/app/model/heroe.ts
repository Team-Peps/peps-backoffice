import {Game} from './game';

export interface Heroe {
	id: string;
	name: string;
	role: OverwatchHeroRole;
	imageKey: string;
	game: Game;
}

export enum OverwatchHeroRole {
	TANK = "TANK",
	DAMAGE = "DAMAGE",
	SUPPORT = "SUPPORT",
}

export enum MarvelRivalsHeroRole {
	VANGUARD = "VANGUARD",
	STRATEGIST = "STRATEGIST",
	DUELIST = "DUELIST",
}
