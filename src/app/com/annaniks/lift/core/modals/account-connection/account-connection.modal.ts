import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MainService } from '../../../pages/main/main.service';
import { ServerResponse } from '../../models/server-response';

@Component({
    selector: "account-connection-modal",
    templateUrl: "account-connection.modal.html",
    styleUrls: ["account-connection.modal.scss"]
})

export class AccountConnectionModal implements OnInit {
    public tab: number = 1;
    public loginForm: FormGroup;
    public tariffForm: FormGroup;
    public actionForm: FormGroup;
    public promotionForm: FormGroup;
    public showCode: boolean = false;

    constructor(private _fb: FormBuilder, private _mainService: MainService) { }

    ngOnInit() {
        this._formBuilder();
    }


    private _formBuilder(): void {
        this.loginForm = this._fb.group({
            email: ["", Validators.required],
            password: ["", Validators.required],
        })
        this.tariffForm = this._fb.group({
            tariff: [null, Validators.required]
        })
        this.tariffForm.valueChanges.subscribe((data) => {
            console.log(data);
        })
        this.actionForm = this._fb.group({
            action: [null, Validators.required]
        })
        this.promotionForm = this._fb.group({
            autosubscription: [""],
            autoreviewstories: [""],
            bonus: [""]
        })
        this.promotionForm.valueChanges.subscribe((data) => {
            console.log(data);

        })

    }
    public changedTab(tab): void {
        this.tab = tab;
    }

    public checkIsValid(controleName): boolean {
        return this.loginForm.get(controleName).hasError('required') && this.loginForm.get(controleName).touched;
    }


    public addAccount(): void {
        this._mainService.addAccount({
            email: this.loginForm.value.email,
            password: this.loginForm.value.password,
        }).subscribe((data) => {
            this.showCode = true;
            this.loginForm.get('email').disable();
            this.loginForm.get('password').disable();
            this.loginForm.addControl('code',new FormControl(null,Validators.required));
            console.log(data);
        })
    }
}