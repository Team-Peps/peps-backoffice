import {Roster} from '../roster';
import {MatchRoundDto} from './matchRoundDto';

export interface Match {
	id?: string;
	date: string;
	score?: number;
	opponentScore?: number;
	competitionName: string;
	type: string;
	roster: Roster;
	opponentRoster: Roster;
}

export interface MatchFormUpcoming {
	date: string;
	competitionName: string;
	game?: string;
	type: string;
	roster: string;
	opponentRoster: string;
}

export interface MatchFinishedDto {
	datetime: string;
	competitionName: string;
	type: string;
	roster: string;
	opponentRoster: string;
	game: string;
	score: number;
	opponentScore: number;
	pepsPlayers: string[];
	opponentPlayers: string[];
	rounds: MatchRoundDto[];
}
