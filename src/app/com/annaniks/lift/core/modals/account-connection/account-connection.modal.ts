import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: "account-connection-modal",
    templateUrl: "account-connection.modal.html",
    styleUrls: ["account-connection.modal.scss"]
})

export class AcocountConnectionModal implements OnInit {
    public tab: number = 1;
    public loginForm: FormGroup;
    public tariffForm:FormGroup;
    public actionForm:FormGroup;
    public promotionForm:FormGroup;

    constructor(private _fb:FormBuilder) { }

    ngOnInit() {
        this._formBuilder();
    }


    private _formBuilder(): void {
        this.loginForm = this._fb.group({
            email: ["", Validators.required],
            password: ["", Validators.required]
        })
        this.tariffForm = this._fb.group({
            tariff:[null,Validators.required]
        })
        this.tariffForm.valueChanges.subscribe((data)=>{
            console.log(data);
        })
        this.actionForm=this._fb.group({
            action:[null,Validators.required]
        })
        this.promotionForm=this._fb.group({
            autosubscription:[""],
            autoreviewstories:[""],
            bonus:[""]
        })
        this.promotionForm.valueChanges.subscribe((data)=>{
            console.log(data);
            
        })

    }
    public changedTab(tab): void {
        this.tab = tab;
    }

    public checkIsValid(controleName): boolean {
        return this.loginForm.get(controleName).hasError('required') && this.loginForm.get(controleName).touched;
    }
}