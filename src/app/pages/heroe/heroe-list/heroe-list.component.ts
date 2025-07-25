import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Heroe} from '@/app/model/heroe';
import {HeroeService} from '@/app/service/heroe.service';
import {environment} from '@/environments/environment';
import {UpdateHeroeComponent} from '../update-heroe/update-heroe.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-heroe-list',
	imports: [
		UpdateHeroeComponent,
		NgClass,
	],
  templateUrl: './heroe-list.component.html',
})
export class HeroeListComponent implements OnInit {

	constructor(
		private readonly heroService: HeroeService,
		private readonly cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.loadHeroes();
    }

	minioBaseUrl = environment.minioBaseUrl;

	heroesOverwatch: Heroe[] = [];
	heroesMarvelRivals: Heroe[] = [];

	selectedHeroe: Heroe | null = null;
	isCreateHeroe: boolean = false;

	loadHeroes() {
		this.heroService.getAllHeroes().subscribe(response => {
			this.heroesOverwatch = response['overwatch'];
			this.heroesMarvelRivals = response['marvel-rivals'];
			this.cdr.detectChanges();
		})
	}

	selectHeroe(heroe: Heroe) {
		this.selectedHeroe = heroe;
		this.isCreateHeroe = false;
		this.cdr.detectChanges();
		document.getElementById('updateHeroe')?.scrollIntoView({behavior: 'smooth'});
	}

	toggleCreateHeroe() {
		this.isCreateHeroe = !this.isCreateHeroe;
		this.selectedHeroe = null;
		this.cdr.detectChanges();
	}
}
