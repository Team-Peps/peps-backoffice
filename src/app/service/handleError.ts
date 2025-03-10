import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';

/**
 * Gestion centralisée des erreurs HTTP
 */
export function handleError(error: HttpErrorResponse) {
	let errorMsg = 'Une erreur inconnue est survenue';

	if (error.error instanceof ErrorEvent) {
		errorMsg = `Erreur client : ${error.error.message}`;
	} else {
		switch (error.status) {
			case 400:
				errorMsg = 'Requête invalide';
				break;
			case 404:
				errorMsg = 'Membre introuvable';
				break;
			case 500:
				errorMsg = 'Erreur interne du serveur';
				break;
			default:
				errorMsg = `Erreur ${error.status}: ${error.message}`;
		}
	}

	console.error('❌', errorMsg);
	return throwError(() => new Error(errorMsg));
}
