import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Our Shared Components
import { SubmenuComponent } from './submenu/submenu.component';
import { CommonModule } from '@angular/common';
import { LimitsComponent } from './limits/limits.component';
import { FooterNavigationComponent } from './footer-navigation/footer-navigation.component';
import { LineChartComponent } from './line-chart/line-chart.component';

// 3rd Part Libraries
import { NgxEchartsModule } from 'ngx-echarts';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
    declarations: [
        SubmenuComponent,
        LimitsComponent,
        FooterNavigationComponent,
        LineChartComponent
    ],
    exports: [
        SubmenuComponent,
        LimitsComponent,
        NgxEchartsModule,
        ClickOutsideModule,
        FooterNavigationComponent,
        LineChartComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgxEchartsModule,
        ClickOutsideModule,
    ]
})
export class SharedModule { }
