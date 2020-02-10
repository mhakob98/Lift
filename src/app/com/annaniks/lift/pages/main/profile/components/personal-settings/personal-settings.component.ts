import { Component, OnInit, OnDestroy, Input, AfterViewInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../profile.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ChangeMe } from 'src/app/com/annaniks/lift/core/models/change-me';
import { User } from 'src/app/com/annaniks/lift/core/models/user';

@Component({
    selector: "personal-settings",
    templateUrl: "personal-settings.component.html",
    styleUrls: ["personal-settings.component.scss"]
})

export class PersonalSettings implements OnInit, OnDestroy, AfterViewInit {
    @Input('user')
    set _userData(event) {
        this._formBuilder();
        if (event) {
            this._bindPersonalSettings(event);
        }
    }
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public dataForm: FormGroup;
    public contactForm: FormGroup;
    public loading: boolean = false;

    constructor(
        private _fb: FormBuilder,
        private _profileService: ProfileService
    ) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        console.log(this._userData);
    }

    private _formBuilder(): void {
        this.dataForm = this._fb.group({
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
        this.dataForm.valueChanges.subscribe(() => console.log(this.dataForm))

    }


    public checkIsValid(formGroup, cotrolName): boolean {
        return formGroup.get(cotrolName).hasError('required') && formGroup.get(cotrolName).touched;
    }

    public changeMe(): void {
        this.loading = true
        let dataForm = this.dataForm.value
        let contactForm = this.contactForm.value
        let sendingData: ChangeMe = {
            name: dataForm.name,
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

    private _bindPersonalSettings(settings): void {

        this.contactForm.patchValue({
            phoneNumber: settings.city,
            currentCity: settings.phone
        })

        this.dataForm.patchValue({
            name: settings.name,
            day: settings.day,
            month: settings.month,
            year: settings.year,
            male: settings.male == 'male ' ? true : false
        })
    }

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.unsubscribe();
    }
}