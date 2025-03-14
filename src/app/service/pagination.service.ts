import {Injectable} from '@angular/core';

@Injectable({
	  providedIn: 'root'
})
export class PaginationService {

	paginate<T>(items: T[], page: number, pageSize: number): T[] {
		const startIndex = (page - 1) * pageSize;
		return items.slice(startIndex, startIndex + pageSize);
	}

	getTotalPages(totalItems: number, pageSize: number): number {
		return Math.ceil(totalItems / pageSize);
	}
}
