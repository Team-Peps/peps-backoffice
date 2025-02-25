import { Component } from '@angular/core';
import {TooltipPosition} from './tooltip.enum';

@Component({
  selector: 'app-tooltip',
  imports: [],
  templateUrl: './tooltip.component.html',
})
export class TooltipComponent {

	position: TooltipPosition = TooltipPosition.DEFAULT;
	tooltip: string = '';
	left: number = 0;
	top: number = 0;
	visible: boolean = false;

}
