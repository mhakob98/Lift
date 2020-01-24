import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: "additional-settings",
    templateUrl: "additional-settings.component.html",
    styleUrls: ["additional-settings.component.scss"]
})

export class AdditionalSettings implements OnInit {

    public additionalForm: FormGroup;
    public pagesForm: FormGroup;

    constructor(private _fb: FormBuilder) { }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.additionalForm = this._fb.group({
            service: [""],
            occupation: [""],
            activity: [""],
            description:["",Validators.required]
        })
        this.pagesForm = this._fb.group({
            instagram: ["", Validators.required],
            facebook: ["", Validators.required]
        })
    }

    public checkIsValid(formGroup,controlName): boolean {
        return formGroup.get(controlName).hasError('required') && formGroup.get(controlName).touched;
    }
}