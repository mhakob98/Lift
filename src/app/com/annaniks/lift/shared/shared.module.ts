import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Our Shared Components
import { CommonModule } from '@angular/common';
import { LimitsComponent } from './limits/limits.component';
import { FooterNavigationComponent } from './footer-navigation/footer-navigation.component';

// 3rd Part Libraries
import { NgxEchartsModule } from 'ngx-echarts';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
    declarations: [
        LimitsComponent,
        FooterNavigationComponent
    ],
    exports: [
        LimitsComponent,
        NgxEchartsModule,
        ClickOutsideModule,
        FooterNavigationComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgxEchartsModule,
        ClickOutsideModule,
    ]
})
export class SharedModule { }
