import { Component, OnInit, Inject } from '@angular/core';
import { AffiliateProgramService } from './affiliate-program.service';
import { AffiliateProgramOperation } from '../../../core/models/affiliate-program';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../core/models/user';
import { Location, PlatformLocation, DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-affiliate-program',
    templateUrl: 'affiliate-program.component.html',
    styleUrls: ['affiliate-program.component.scss']
})
export class AffiliateProgramComponent implements OnInit {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public referalCodeControl = new FormControl();
    public affiliateProgramOperation: AffiliateProgramOperation[] = [
        { data: "12 Января 2020", transitions: 35, registrations: 3, operations: 120, income: 19.35 },
        { data: "12 Января 2020", transitions: 35, registrations: 3, operations: 120, income: 19.35 },
        { data: "12 Января 2020", transitions: 35, registrations: 3, operations: 120, income: 19.35 },
        { data: "12 Января 2020", transitions: 35, registrations: 3, operations: 120, income: 19.35 },
        { data: "12 Января 2020", transitions: 35, registrations: 3, operations: 120, income: 19.35 },
        { data: "12 Января 2020", transitions: 35, registrations: 3, operations: 120, income: 19.35 },
    ];

    constructor(
        private _affiliateProgramService: AffiliateProgramService,
        private _authService: AuthService,
        private _toastrService: ToastrService,
        @Inject(DOCUMENT) private _document: Document) { }

    ngOnInit() {
        this._getUser();
        this._getAffiliateProgramOperation();
    }

    private _getUser(): void {
        this._authService.getUserState()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((user: User) => {
                const refferalCode: string = user.refferalCode;
                const origin: string = this._document.location.origin;
                const url: string = `${origin}/join/${refferalCode}`;
                this.referalCodeControl.patchValue(url);
            })
    }

    public copyInputMessage(inputElement): void {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this._toastrService.success('Скопировано в буфер обмена')
    }

    private _getAffiliateProgramOperation(): void {
        this._affiliateProgramService.getAffiliateProgramOperation()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data) => {
                // this.affiliateProgramOperation = data;
            })
    }

}