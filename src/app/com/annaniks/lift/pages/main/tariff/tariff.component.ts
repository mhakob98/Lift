import { Component, OnInit } from "@angular/core";
import { TariffService } from './tariff.service';
import { TariffOperation, Tariff } from '../../../core/models/tariff';

@Component({
    selector: "app-tariff",
    templateUrl: "tariff.component.html",
    styleUrls: ["tariff.component.scss"]
})

export class TariffComponent implements OnInit {

    public tariff: Tariff;
    public localImage: string = "assets/images/boy.png";

    public tariffOperation: TariffOperation[] = [
        { data: "12 Января 2020", operation: "Списание со счета", cost: 1200, status: "проведено" },
        { data: "12 Января 2020", operation: "Списание со счета", cost: 1200, status: "проведено" },
        { data: "12 Января 2020", operation: "Списание со счета", cost: 1200, status: "проведено" },
        { data: "12 Января 2020", operation: "Списание со счета", cost: 1200, status: "проведено" },
        { data: "12 Января 2020", operation: "Списание со счета", cost: 1200, status: "проведено" },
        { data: "12 Января 2020", operation: "Списание со счета", cost: 1200, status: "проведено" },
        { data: "12 Января 2020", operation: "Списание со счета", cost: 1200, status: "Отменено" },
    ];
    constructor(private _tariffService: TariffService) { }

    ngOnInit() {
        this._getTariff();
     this. _getTariffOpetation();
    }


    private _getTariff(): void {
        this._tariffService.getTariff().subscribe((data) => {
            this.tariff = { image: "assets/images/post2.png", current: "Текущий тариф", type: "Оптимальный", paid: "15.03.2020" };
            this.localImage = this.tariff.image;
            // this.tariff = data.data;

        })
    }

    private _getTariffOpetation(): void {
        this._tariffService.getTariffOpetation().subscribe((data) => {
            // this.tariffOperation = data.data;
        })
    }
}