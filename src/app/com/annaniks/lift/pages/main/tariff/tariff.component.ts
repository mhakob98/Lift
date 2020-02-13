import { Component, OnInit, OnDestroy } from "@angular/core";
import { TariffService } from './tariff.service';
import { TariffTransaction, Tariff } from '../../../core/models/tariff';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MainService } from '../main.service';

@Component({
    selector: "app-tariff",
    templateUrl: "tariff.component.html",
    styleUrls: ["tariff.component.scss"]
})

export class TariffComponent implements OnInit, OnDestroy {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public tariff: Tariff;
    public localImage: string = "assets/images/boy.png";

    public tariffTransaction: TariffTransaction[] = [];
    public page: number = 1;
    public loading: boolean = false;
    constructor(
        private _tariffService: TariffService,
        private _mainService: MainService
    ) { }

    ngOnInit() {
        this._getTariff();
        this._getTariffTransaction();
    }


    private _getTariff(): void {
        this._tariffService.getTariff()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data) => {
                this.tariff = { image: "assets/images/post2.png", current: "Текущий тариф", type: "Оптимальный", paid: "15.03.2020" };
                this.localImage = this.tariff.image;
            })
    }


    public onClickSeeMore(): void {
        this.page = this.page + 1;
        this._getTariffTransaction();

    }

    private _getTariffTransaction(): void {
        this.loading = true;
        this._tariffService.getTariffTransaction((this.page - 1) * 10, this.page * 10)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data) => {

                this.tariffTransaction.push(...data.data)
                const tariffTransactionStatuses = this._mainService.accountSettingsVariantsSync.transactionStatuses;
                this.tariffTransaction.map((element, index) => {
                    tariffTransactionStatuses.map((el, ind) => {
                        if (element.status === el.id) {
                            element.statusStr = el.name;
                        }
                    })
                })
                console.log(data);
                this.loading = false;
            })


    }



    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}