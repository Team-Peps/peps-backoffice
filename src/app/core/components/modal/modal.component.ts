import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
	selector: 'app-modal',
	imports: [],
	templateUrl: './modal.component.html',
})
export class ModalComponent {

	@Input() title: string = '';
	@Input() type: ModalType = 'default';
	@Input() content: string = '';
	@Input() action: string = '';
	@Output() okAction: EventEmitter<void> = new EventEmitter();
	@Output() closeAction: EventEmitter<void> = new EventEmitter();

	onModalClose(): void {
		this.closeAction.emit();
	}

	onOkAction(): void {
		this.okAction.emit();
	}

}

type ModalType = 'default' | 'danger' | 'success' | 'info';
