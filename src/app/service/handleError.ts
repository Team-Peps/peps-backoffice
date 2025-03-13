import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';

export function handleError(error: HttpErrorResponse) {
	let errorMessage = 'Une erreur inconnue est survenue';
	if (error.error) {
		if (typeof error.error === 'string') {
			errorMessage = error.error; // Erreur en texte brut
		} else if (error.error.message) {
			errorMessage = error.error.message; // JSON avec message d'erreur
		} else if (error.error.errors) {
			errorMessage = Object.values(error.error.errors).join(', '); // Erreurs de validation
		}
	}
	return throwError(() => new Error(errorMessage));
}
