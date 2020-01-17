import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Our Shared Components
import { CommonModule } from '@angular/common';
import { LimitsComponent } from './limits/limits.component';
import { FooterNavigationComponent } from './footer-navigation/footer-navigation.component';
import { LineChartComponent } from './line-chart/line-chart.component';

// 3rd Part Libraries
import { NgxEchartsModule } from 'ngx-echarts';
import { ClickOutsideModule } from 'ng-click-outside';

// PrimeNG
import { AutoCompleteModule } from 'primeng/autocomplete';

// Angular Material
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
    declarations: [
        LimitsComponent,
        FooterNavigationComponent,
        LineChartComponent
    ],
    exports: [
        LimitsComponent,
        NgxEchartsModule,
        ClickOutsideModule,
        FooterNavigationComponent,
        LineChartComponent,
        AutoCompleteModule,
        MatSliderModule,
        MatCheckboxModule
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgxEchartsModule,
        ClickOutsideModule,
        AutoCompleteModule,
        MatSliderModule,
        MatCheckboxModule
    ]
})
export class SharedModule { }
