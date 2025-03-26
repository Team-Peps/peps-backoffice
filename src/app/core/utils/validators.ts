import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function dateInPastValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;
		if (!value) return null;

		const inputDate = new Date(value);
		const now = new Date();

		return inputDate > now
			? { dateInFuture: true }
			: null;
	};
}
