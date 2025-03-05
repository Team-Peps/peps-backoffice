export function determineGameLogo(game: string): string {
	switch (game.toLowerCase()) {
		case 'overwatch':
			return 'assets/overwatch.svg';
		case 'marvel-rivals':
			return 'assets/marvel-rivals.svg';
		default:
			return '';
	}
}
