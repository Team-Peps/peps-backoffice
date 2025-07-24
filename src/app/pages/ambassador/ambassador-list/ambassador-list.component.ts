import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AmbassadorService} from '@/app/service/ambassador.service';
import {environment} from '@/environments/environment';
import {Ambassador} from '@/app/model/ambassador';
import {BehaviorSubject, Observable} from 'rxjs';
import {UpdateAmbassadorComponent} from '../update-ambassador/update-ambassador.component';
import {AsyncPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {ToastService} from '@/app/service/toast.service';

@Component({
  selector: 'app-ambassador-list',
	imports: [
		UpdateAmbassadorComponent,
		AsyncPipe,
		NgOptimizedImage,
		NgClass
	],
  templateUrl: './ambassador-list.component.html',
})
export class AmbassadorListComponent implements OnInit {

	constructor(
		private readonly ambassadorService: AmbassadorService,
		private readonly cdr: ChangeDetectorRef,
		private readonly toastService: ToastService
	) {}

	ngOnInit(): void {
		this.loadAmbassadors();
    }

	minioBaseUrl = environment.minioBaseUrl;

	private ambassadorsSubject = new BehaviorSubject<Ambassador[]>([]);
	ambassadors$: Observable<Ambassador[]> = this.ambassadorsSubject.asObservable();

	selectedAmbassador: Ambassador | null = null;
	isCreateAmbassador: boolean = false;
	isWantDelete: boolean = false;

	loadAmbassadors() {
		this.ambassadorService.getAllAmbassadors().subscribe({
			next: (ambassadors) => {
				this.ambassadorsSubject.next(ambassadors);
				this.selectedAmbassador = null;
				this.isCreateAmbassador = false;
				this.cdr.detectChanges();
			}
		})
	}

	selectAmbassador(ambassador: Ambassador) {
		this.selectedAmbassador = ambassador;
		this.isCreateAmbassador = false;
		this.cdr.detectChanges();
		document.getElementById('updateAmbassador')?.scrollIntoView({behavior: 'smooth'});
	}

	toggleCreateAmbassador() {
		this.isCreateAmbassador = !this.isCreateAmbassador;
		this.selectedAmbassador = null;
		this.cdr.detectChanges();
	}

	deleteAmbassador(ambassador: Ambassador) {
		this.ambassadorService.deleteAmbassador(ambassador.id!).subscribe({
			next: (res) => {
				this.toastService.show(res.message, 'success');
				this.loadAmbassadors();
			},
			error: (error) => {
				console.error('Error deleting ambassador:', error);
				this.toastService.show('Erreur lors de la suppression de l\'ambassadeur', 'error');

			}
		})
	}

	closeDeleteModal() {
		this.selectedAmbassador = null;
		this.isWantDelete = false;
	}

	closeUpdateModal() {
		this.selectedAmbassador = null;
		this.isCreateAmbassador = false;
	}

	wantDeleteAmbassador(ambassador: Ambassador) {
		this.selectedAmbassador = ambassador;
		this.isWantDelete = true;
		this.cdr.detectChanges();
	}

	confirmDelete() {
		if (this.selectedAmbassador) {
			this.deleteAmbassador(this.selectedAmbassador);
		}
		this.isWantDelete = false;
		this.selectedAmbassador = null;
		this.cdr.detectChanges();
	}
}
