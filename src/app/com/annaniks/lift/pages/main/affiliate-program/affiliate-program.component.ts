import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-affiliate-program',
    templateUrl: 'affiliate-program.component.html',
    styleUrls: ['affiliate-program.component.scss']
})
export class AffiliateProgramComponent implements OnInit {

    constructor() { }

    ngOnInit() { }

    public copyToClipboard(): void {
        var copyText = document.getElementById("link-to-copy") as any;
        copyText.select();
        document.execCommand("copy");
    }
}