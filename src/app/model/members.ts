export interface Members {
	id: string;
	pseudo: string;
	lastname: string;
	firstname: string;
	dateOfBirth: string;
	age: number;
	nationality: string;
	role: Role,
	dpi?: number;
}

export enum Role {
	PLAYER = 'PLAYER',
	DPS = 'DPS',
	TANK = 'TANK',
	SUPPORT = 'SUPPORT',
	COACH = 'COACH',
	MANAGER = 'MANAGER',
}
