export interface Match {
	id: string;
	datetime: string;
	game: string;
	opponent: string;
	competitionName: string;
	score: number;
	opponentScore: number;
	vodUrl: string;
	streamUrl: string;
}

export type GroupedMatches = Record<string, Match[]>;
