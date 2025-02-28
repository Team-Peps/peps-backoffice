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
import {Role} from '../../../model/role';
import {Member} from '../../../model/member';
import {MemberService} from '../../../service/member.service';
import {ToastService} from '../../../service/toast.service';
import {RosterService} from '../../../service/roster.service';
import {Roster} from '../../../model/roster';
import {BehaviorSubject} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-update-member',
	imports: [
		ReactiveFormsModule,
		AsyncPipe,
	],
  templateUrl: './update-member.component.html',
})
export class UpdateMemberComponent implements OnInit, OnChanges {

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly memberService: MemberService,
		private readonly toastService: ToastService,
		private readonly rosterService: RosterService
	) {}

	memberForm: FormGroup = new FormGroup({
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
	protected readonly Role = Role;

	@Input() member: Member | null = null;
	@Output() memberSaved = new EventEmitter();

	ngOnInit() {
		this.loadRosters();
	}

	ngOnChanges() {
		this.initForm();
	}

	initForm() {
		if (this.member) {
			this.memberForm.setValue({
				pseudo: this.member.pseudo,
				lastname: this.member.lastname,
				firstname: this.member.firstname,
				dateOfBirth: new Date(this.member.dateOfBirth).toISOString().substring(0, 10),
				nationality: this.member.nationality,
				role: this.member.role,
				dpi: this.member.dpi,
				roster: null
			});
			this.memberForm.get('roster')!.clearValidators();
			this.memberForm.get('roster')!.setValidators([Validators.required]);
		}else{
			this.memberForm.reset();
		}
		this.memberForm.get('roster')!.updateValueAndValidity();
		this.cdr.detectChanges();
	}

	saveOrUpdate(){
		if(this.member) {
			this.update();
		}else{
			this.save();
		}
	}

	save(){
		if (this.memberForm.invalid) {
			this.toastService.show('Veuillez remplir tous les champs obligatoires', 'error');
			return;
		}
		this.memberService.saveMember(this.memberForm.value).subscribe({
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
		const updateData = { ...this.memberForm.value, id: this.member!.id };

		if (!updateData.roster) {
			delete updateData.roster;
		}
		this.memberService.updateMember(updateData).subscribe({
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
		this.rosterService.getRosters().subscribe(rosters => {
			this.rostersSubjet.next(rosters);
		});
	}
}
