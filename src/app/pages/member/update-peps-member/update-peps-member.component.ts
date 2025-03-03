import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges, OnInit,
	Output
} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {getNationalityName, Nationality} from '../../../model/nationality';
import {enumKeysObject} from '../../../core/utils/enum';
import {PepsMember} from '../../../model/member/member';
import {MemberService} from '../../../service/member.service';
import {ToastService} from '../../../service/toast.service';
import {RosterService} from '../../../service/roster.service';
import {Roster} from '../../../model/roster';
import {BehaviorSubject} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {MemberRole} from '../../../model/member/memberRole';

@Component({
  selector: 'app-update-peps-member',
	imports: [
		ReactiveFormsModule,
		AsyncPipe,
	],
  templateUrl: './update-peps-member.component.html',
})
export class UpdatePepsMemberComponent implements OnInit, OnChanges {

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly memberService: MemberService,
		private readonly toastService: ToastService,
		private readonly rosterService: RosterService
	) {}

	pepsMemberForm: FormGroup = new FormGroup({
		pseudo: new FormControl(Validators.required),
		lastname: new FormControl(Validators.required),
		firstname: new FormControl(Validators.required),
		dateOfBirth: new FormControl(Validators.required),
		nationality: new FormControl(Validators.required),
		role: new FormControl(Validators.required),
		dpi: new FormControl(),
		roster: new FormControl(null)
	})

	private rostersSubjet = new BehaviorSubject<Roster[]>([]);
	rosters$ = this.rostersSubjet.asObservable();
	protected readonly Nationality = Nationality;
	protected readonly enumKeysObject = enumKeysObject;
	protected readonly getNationalityName = getNationalityName;
	protected readonly Role = MemberRole;

	@Input() pepsMember: PepsMember | null = null;
	@Output() memberSaved = new EventEmitter();

	ngOnInit() {
		this.loadRosters();
	}

	ngOnChanges() {
		this.initForm();
	}

	initForm() {
		if (this.pepsMember) {
			this.pepsMemberForm.setValue({
				pseudo: this.pepsMember.pseudo,
				lastname: this.pepsMember.lastname,
				firstname: this.pepsMember.firstname,
				dateOfBirth: new Date(this.pepsMember.dateOfBirth).toISOString().substring(0, 10),
				nationality: this.pepsMember.nationality,
				role: this.pepsMember.role,
				dpi: this.pepsMember.dpi,
				roster: null
			});
			this.pepsMemberForm.get('roster')!.clearValidators();
			this.pepsMemberForm.get('roster')!.setValidators([Validators.required]);
		}else{
			this.pepsMemberForm.reset();
		}
		this.pepsMemberForm.get('roster')!.updateValueAndValidity();
		this.cdr.detectChanges();
	}

	saveOrUpdate(){
		if(this.pepsMember) {
			this.update();
		}else{
			this.save();
		}
	}

	save(){
		if (this.pepsMemberForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}
		this.memberService.savePepsMember(this.pepsMemberForm.value).subscribe({
			next: (response) => {
				this.memberSaved.emit();
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	update(){
		const updateData = { ...this.pepsMemberForm.value, id: this.pepsMember!.id };

		if (!updateData.roster) {
			delete updateData.roster;
		}
		this.memberService.updatePepsMember(updateData).subscribe({
			next: (response) => {
				this.memberSaved.emit();
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'error');
			}
		});
	}

	loadRosters() {
		this.rosterService.getPepsRosters().subscribe(rosters => {
			this.rostersSubjet.next(rosters);
		});
	}
}
