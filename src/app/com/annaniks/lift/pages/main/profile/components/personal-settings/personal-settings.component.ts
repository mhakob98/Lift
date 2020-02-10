import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../profile.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ChangeMe } from 'src/app/com/annaniks/lift/core/models/change-me';

@Component({
    selector: "personal-settings",
    templateUrl: "personal-settings.component.html",
    styleUrls: ["personal-settings.component.scss"]
})

export class PersonalSettings implements OnInit, OnDestroy {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public dataForm: FormGroup;
    public contactForm: FormGroup;
    public loading: boolean = false;

    constructor(
        private _fb: FormBuilder,
        private _profileService: ProfileService
    ) { }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.dataForm = this._fb.group({
            lastname: ["", Validators.required],
            name: ["", Validators.required],
            day: ["", Validators.required],
            month: ["", Validators.required],
            year: ["", Validators.required],
            male: true
        })
        this.contactForm = this._fb.group({
            phoneNumber: ["", Validators.required],
            currentCity: ["", Validators.required]
        })
    }


    public checkIsValid(formGroup, cotrolName): boolean {
        return formGroup.get(cotrolName).hasError('required') && formGroup.get(cotrolName).touched;
    }

    public changeMe(): void {
        this.loading = true
        let dataForm = this.dataForm.value
        let contactForm = this.contactForm.value
        let sendingData: ChangeMe = {
            name: dataForm.name + dataForm.lastname,
            male: dataForm.male,
            dbDay: dataForm.day,
            dbMount: dataForm.month,
            dbYear: dataForm.year,
            city: contactForm.currentCity,
            phone: contactForm.phoneNumber,

        }
        this._profileService.changeMe(sendingData)
            .pipe(
                takeUntil(this._unsubscribe$),
                finalize(() => this.loading = false)
            ).
            subscribe((response) => {
                console.log(response);

            })
    }

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.unsubscribe();
    }
}