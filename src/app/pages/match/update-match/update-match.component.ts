import { Match } from '@/app/model/match';
import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Ambassador} from '@/app/model/ambassador';
import {ToastService} from '@/app/service/toast.service';
import {MatchService} from '@/app/service/match.service';

@Component({
	selector: 'app-update-match',
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './update-match.component.html',
})
export class UpdateMatchComponent implements OnChanges {

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly toastService: ToastService,
		private readonly matchService: MatchService,
	) {}

	ngOnChanges(): void {
		this.initForm();
    }

	matchForm: FormGroup = new FormGroup({
		vodUrl: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
	});

	@Input() match: Match | null = null;
	@Output() matchUpdated: EventEmitter<Ambassador | null> = new EventEmitter();

	initForm(): void {
		if (this.match) {
			this.matchForm.patchValue({
				vodUrl: this.match.vodUrl || '',
			});
		}
		this.cdr.detectChanges();
	}

	updateMatch(): void {
		if(this.matchForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}
		this.update();
	}

	update() {
		const { vodUrl } = this.matchForm.value;

		this.matchService.updateVodUrl(this.match!.id!, vodUrl).subscribe({
			next: (response) => {
				this.matchUpdated.emit();
				this.toastService.show(response.message, 'success');
				this.matchForm.reset();
			},
			error: (error) => {
				this.toastService.show(error.error.message, 'error');
			}
		})

	}

}
