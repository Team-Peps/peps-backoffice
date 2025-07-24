import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-toast',
	imports: [
	],
  templateUrl: './toast.component.html',
})
export class ToastComponent implements OnInit {

	constructor(
	) {}

	ngOnInit(): void {
		setTimeout(() => {
			this.removeToast();
		}, this.duration);
	}

	@Input() type: ToastType = 'info';
	@Input() message: string = '';
	@Input() details: string = '';
	@Input() duration: number = 3000;

	removeToast(): void {
		document.getElementById(this.message)?.remove();
	}

}

export type ToastType = 'error' | 'info' | 'success';
