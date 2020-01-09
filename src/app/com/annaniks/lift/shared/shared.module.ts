import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Our Shared Components
import { SubmenuComponent } from './submenu/submenu.component';
import { CommonModule } from '@angular/common';
import { LimitsComponent } from './limits/limits.component';

// 3rd Part Libraries
import { NgxEchartsModule } from 'ngx-echarts';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
    declarations: [
        SubmenuComponent,
        LimitsComponent
    ],
    exports: [
        SubmenuComponent,
        LimitsComponent,
        NgxEchartsModule,
        ClickOutsideModule
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgxEchartsModule,
        ClickOutsideModule
    ]
})
export class SharedModule { }
