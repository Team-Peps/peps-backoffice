export type MapType = 'CONTROL' | 'ASSAULT' | 'HYBRID' | 'ESCORT' | 'FLASHPOINT';

export interface Map {
	id: string;
	name: string;
	type: MapType;
}

export const maps = [
	{
		"id": "antarctic_peninsula",
		"name": "Antarctic Peninsula",
		"type": "CONTROL"
	},
	{
		"id": "blizzard_world",
		"name": "Blizzard World",
		"type": "HYBRID"
	},
	{
		"id": "busan",
		"name": "Busan",
		"type": "CONTROL"
	},
	{
		"id": "circuit_royal",
		"name": "Circuit Royal",
		"type": "ESCORT"
	},
	{
		"id": "colosseo",
		"name": "Colosseo",
		"type": "PUSH"
	},
	{
		"id": "dorado",
		"name": "Dorado",
		"type": "ESCORT"
	},
	{
		"id": "eichenwalde",
		"name": "Eichenwalde",
		"type": "HYBRID"
	},
	{
		"id": "esperanca",
		"name": "Esperança",
		"type": "PUSH"
	},
	{
		"id": "gibraltar",
		"name": "Watchpoint: Gibraltar",
		"type": "ESCORT"
	},
	{
		"id": "havana",
		"name": "Havana",
		"type": "ESCORT"
	},
	{
		"id": "hollywood",
		"name": "Hollywood",
		"type": "HYBRID"
	},
	{
		"id": "ilios",
		"name": "Ilios",
		"type": "CONTROL"
	},
	{
		"id": "junkertown",
		"name": "Junkertown",
		"type": "ESCORT"
	},
	{
		"id": "kings_row",
		"name": "King’s Row",
		"type": "HYBRID"
	},
	{
		"id": "lijiang",
		"name": "Lijiang Tower",
		"type": "CONTROL"
	},
	{
		"id": "midtown",
		"name": "Midtown",
		"type": "HYBRID"
	},
	{
		"id": "nepal",
		"name": "Nepal",
		"type": "CONTROL"
	},
	{
		"id": "new_junk_city",
		"name": "New Junk City",
		"type": "FLASHPOINT"
	},
	{
		"id": "new_queen_street",
		"name": "New Queen Street",
		"type": "CONTROL"
	},
	{
		"id": "numbani",
		"name": "Numbani",
		"type": "HYBRID"
	},
	{
		"id": "oasis",
		"name": "Oasis",
		"type": "CONTROL"
	},
	{
		"id": "paraiso",
		"name": "Paraíso",
		"type": "HYBRID"
	},
	{
		"id": "rialto",
		"name": "Rialto",
		"type": "ESCORT"
	},
	{
		"id": "route_66",
		"name": "Route 66",
		"type": "ESCORT"
	},
	{
		"id": "runasapi",
		"name": "Runasapi",
		"type": "PUSH"
	},
	{
		"id": "samoa",
		"name": "Samoa",
		"type": "CONTROL"
	},
	{
		"id": "shambali",
		"name": "Shambali Monastery",
		"type": "ESCORT"
	},
	{
		"id": "suravasa",
		"name": "Suravasa",
		"type": "FLASHPOINT"
	},
];
