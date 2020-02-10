import { Component, OnInit } from '@angular/core';
import { AffiliateProgramService } from './affiliate-program.service';
import { AffiliateProgramOperation } from '../../../core/models/affiliate-program';

@Component({
    selector: 'app-affiliate-program',
    templateUrl: 'affiliate-program.component.html',
    styleUrls: ['affiliate-program.component.scss']
})
export class AffiliateProgramComponent implements OnInit {

    public link:string = "https://liftme.pro/partnerlink 8002896share";

    public affiliateProgramOperation: AffiliateProgramOperation[] = [
        { data: "12 Января 2020", transitions: 35, registrations: 3, operations: 120, income: 19.35 },
        { data: "12 Января 2020", transitions: 35, registrations: 3, operations: 120, income: 19.35 },
        { data: "12 Января 2020", transitions: 35, registrations: 3, operations: 120, income: 19.35 },
        { data: "12 Января 2020", transitions: 35, registrations: 3, operations: 120, income: 19.35 },
        { data: "12 Января 2020", transitions: 35, registrations: 3, operations: 120, income: 19.35 },
        { data: "12 Января 2020", transitions: 35, registrations: 3, operations: 120, income: 19.35 },
    ];

    constructor(private _affiliateProgramService: AffiliateProgramService) { }

    ngOnInit() {
        this._getAffiliateProgramOperation();
        console.log(this.link);

    }


    copyInputMessage(inputElement) {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
    }


    private _getAffiliateProgramOperation(): void {
        this._affiliateProgramService.getAffiliateProgramOperation()
            .subscribe((data) => {
                // this.affiliateProgramOperation = data;
            })
    }

}