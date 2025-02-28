import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output
} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {getNationalityName, Nationality} from '../../../model/nationality';
import {enumKeysObject} from '../../../core/utils/enum';
import {Role} from '../../../model/role';
import {Member} from '../../../model/member';
import {MemberService} from '../../../service/member.service';
import {ToastService} from '../../../service/toast.service';

@Component({
  selector: 'app-update-member',
	imports: [
		ReactiveFormsModule,
	],
  templateUrl: './update-member.component.html',
})
export class UpdateMemberComponent implements OnInit, OnChanges {

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly memberService: MemberService,
		private readonly toastService: ToastService,
	) {}

	memberForm: FormGroup = new FormGroup({
		pseudo: new FormControl(),
		lastname: new FormControl(),
		firstname: new FormControl(),
		dateOfBirth: new FormControl(),
		nationality: new FormControl(),
		role: new FormControl(),
		dpi: new FormControl()
	})

	protected readonly Nationality = Nationality;
	protected readonly enumKeysObject = enumKeysObject;
	protected readonly getNationalityName = getNationalityName;
	protected readonly Role = Role;

	@Input() member: Member | null = null;
	@Output() memberSaved = new EventEmitter();

	ngOnInit() {
		this.initForm();
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
				dpi: this.member.dpi
			});
		}
		this.cdr.detectChanges();
	}


	update(){
		this.memberForm.value.id = this.member!.id;
		this.memberService.updateMember(this.memberForm.value).subscribe({
			next: (response) => {
				this.memberSaved.emit();
				this.toastService.show(response.message, 'success');
			},
			error: (error) => {
				console.error("❌ Erreur lors de la sauvegarde :", error);
				this.toastService.show('Une erreur est survenue', 'success');
			}
		});
	}
}
