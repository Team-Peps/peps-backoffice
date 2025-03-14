import {Roster} from '../roster';

export interface Match {
	id: string;
	date: string;
	score?: number;
	opponentScore?: number;
	competitionName: string;
	type: MatchType;
	roster: Roster;
	opponentRoster: Roster;
}
