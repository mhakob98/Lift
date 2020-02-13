import { Component, OnInit, OnDestroy, Input, AfterViewInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../profile.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChangeMe } from '../../../../../core/models/change-me';
import { MainService } from '../../../main.service';
import { AccountSettings } from '../../../../../core/models/account-settings';

@Component({
    selector: "additional-settings",
    templateUrl: "additional-settings.component.html",
    styleUrls: ["additional-settings.component.scss"]
})

export class AdditionalSettings implements OnInit, OnDestroy {
    @Input('user')
    set _userData(event) {
        this._formBuilder();
        if (event) {
            this._bindPersonalSettings(event);
        }
    }

    private _unsubscribe$: Subject<void> = new Subject<void>();
    public additionalForm: FormGroup;
    public pagesForm: FormGroup;
    public loading: boolean = false;
    public settingVariants: AccountSettings

    constructor(
        private _fb: FormBuilder,
        private _profileService: ProfileService,
        private _mainService: MainService
    ) { }

    ngOnInit() {
        this._fetchAccountSettingsVariants()
    }

    private _formBuilder(): void {
        this.additionalForm = this._fb.group({
            service: [null],
            occupation: [null],
            activity: [null],
            description: ["", Validators.required]
        })
        this.pagesForm = this._fb.group({
            instagram: ["", Validators.required],
            facebook: ["", Validators.required]
        })
    }

    public checkIsValid(formGroup, controlName): boolean {
        return formGroup.get(controlName).hasError('required') && formGroup.get(controlName).touched;
    }

    public changeMe(): void {
        this.loading = true
        let additionalForm = this.additionalForm.value
        let pageForm = this.pagesForm.value
        let sendingData: ChangeMe = {
            goalUsing: additionalForm.service,
            occupation: additionalForm.occupation || 0,
            aboutYourself: additionalForm.description,
            facebookLink: pageForm.facebook,
            instagramLink: pageForm.instagram
        }
        this._profileService.changeMe(sendingData)
            .pipe(
                takeUntil(this._unsubscribe$),
                finalize(() => this.loading = false)
            ).
            subscribe()
    }

    private _bindPersonalSettings(settings): void {

        this.pagesForm.patchValue({
            instagram: settings.instagramLink,
            facebook: settings.facebookLink
        })
        this.additionalForm.patchValue({
            service: settings.goalUsing,
            occupation: settings.occupation,
            description: settings.aboutYourself
        })

    }

    private _fetchAccountSettingsVariants(): void {
        this._mainService.getAccountSettingsVariants().pipe(
            takeUntil(this._unsubscribe$)
        ).subscribe(data => {
            this.settingVariants = data
        })
    }

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.unsubscribe();
    }
}