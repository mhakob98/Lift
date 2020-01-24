import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: "personal-settings",
    templateUrl: "personal-settings.component.html",
    styleUrls: ["personal-settings.component.scss"]
})

export class PersonalSettings implements OnInit {

    public dataForm: FormGroup;
    public contactForm:FormGroup;

    constructor(private _fb: FormBuilder) { }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.dataForm = this._fb.group({
            lastname: ["", Validators.required],
            name: ["", Validators.required],
            day: ["", Validators.required],
            month:["", Validators.required],
            year:["", Validators.required]
        })
        this.contactForm = this._fb.group({
            phoneNumber:["", Validators.required],
            currentCity:["",Validators.required]
        })
    }
}