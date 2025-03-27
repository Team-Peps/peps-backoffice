export interface GameMap {
	id: string;
	name: string;
	game: string;
	type: MapType;
	imageKey: string;
}

type MapType = 'CONTROL' | 'ASSAULT' | 'HYBRID' | 'ESCORT' | 'FLASHPOINT' | 'CONVERGENCE' | 'CONVOY' | 'DOMINATION';
