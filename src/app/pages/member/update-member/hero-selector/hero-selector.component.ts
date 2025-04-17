import {ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {Heroe} from '../../../../model/heroe';
import {NgClass} from '@angular/common';
import {environment} from '@/environments/environment';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
	selector: 'hero-selector',
	imports: [
		NgClass
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => HeroSelectorComponent),
			multi: true
		}
	],
	templateUrl: './hero-selector.component.html',
})
export class HeroSelectorComponent implements ControlValueAccessor {

	@Input() heroes: Heroe[] = [];
	selected: Heroe[] = [];
	minioBaseUrl = environment.minioBaseUrl;

	private onChange: any = () => {};
	private onTouched: any = () => {};

	writeValue(value: Heroe[]): void {
		this.selected = value ?? [];
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
	setDisabledState?(isDisabled: boolean): void {
	}

	toggleHero(hero: Heroe): void {
		const index = this.selected.findIndex(h => h.id === hero.id);

		if (index !== -1) {
			this.selected.splice(index, 1);
		} else if (this.selected.length < 3) {
			this.selected.push(hero);
		}

		this.onChange(this.selected);
		this.onTouched();
	}

	isSelected(hero: Heroe): boolean {
		return this.selected.some(h => h.id === hero.id);
	}
}
