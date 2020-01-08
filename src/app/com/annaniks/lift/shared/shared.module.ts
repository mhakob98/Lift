import { NgModule } from '@angular/core';

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
        CommonModule
    ]
})
export class SharedModule { }
