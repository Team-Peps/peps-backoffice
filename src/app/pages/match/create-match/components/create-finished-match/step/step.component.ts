import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-step',
	imports: [
		NgClass
	],
  templateUrl: './step.component.html',
})
export class StepComponent {

	@Input() step: number = 2;

}
