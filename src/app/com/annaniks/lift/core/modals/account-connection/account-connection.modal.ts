import { Component, OnInit } from "@angular/core";

@Component({
    selector: "account-connection-modal",
    templateUrl: "account-connection.modal.html",
    styleUrls: ["account-connection.modal.scss"]
})

export class AcocountConnectionModal implements OnInit {

    public tab: number = 1;
    constructor() { }

    ngOnInit() { }


    public changedTab(tab): void {
        this.tab = tab;
    }
}