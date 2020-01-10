import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Our Shared Components
import { SubmenuComponent } from './submenu/submenu.component';
import { CommonModule } from '@angular/common';
import { LimitsComponent } from './limits/limits.component';

// 3rd Part Libraries
@NgModule({
    declarations: [
        SubmenuComponent,
        LimitsComponent
    ],
    exports: [
        SubmenuComponent,
        LimitsComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class SharedModule { }
