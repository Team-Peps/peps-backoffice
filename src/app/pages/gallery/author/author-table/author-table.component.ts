import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Author} from '@/app/model/author';
import {NgClass, NgOptimizedImage} from '@angular/common';

@Component({
	selector: 'author-table',
	imports: [
		NgOptimizedImage,
		NgClass
	],
	templateUrl: './author-table.component.html',
})
export class AuthorTableComponent {

	@Input() authors: Author[] = [];

	@Output() authorToUpdate: EventEmitter<Author> = new EventEmitter();

	selectAuthor(author: Author) {
		this.authorToUpdate.emit(author);
	}

}
