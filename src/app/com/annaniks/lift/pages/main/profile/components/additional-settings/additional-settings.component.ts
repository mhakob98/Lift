import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../profile.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChangeMe } from 'src/app/com/annaniks/lift/core/models/change-me';

@Component({
    selector: "additional-settings",
    templateUrl: "additional-settings.component.html",
    styleUrls: ["additional-settings.component.scss"]
})

export class AdditionalSettings implements OnInit, OnDestroy {

    private _unsubscribe$: Subject<void> = new Subject<void>();
    public additionalForm: FormGroup;
    public pagesForm: FormGroup;
    public loading: boolean = false;

    constructor(
        private _fb: FormBuilder,
        private _profileService: ProfileService
    ) { }

    ngOnInit() {
        this._formBuilder();
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
        this.additionalForm.valueChanges.subscribe(data => {
            console.log(data);

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
            // goalUsing: additionalForm.service,
            // occupation: additionalForm.occupation || 0,
            aboutYourself: additionalForm.description,
            facebookLink: pageForm.facebook,
            instagramLink: pageForm.instagram
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