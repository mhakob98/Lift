
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { AccountSettingsRoutingModule } from './account-settings.routing.module';

// Our Services
import { AccountSettingsService } from './account-settings.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AccountSettingsRoutingModule.components,
    ],
    imports: [
        AccountSettingsRoutingModule,
        ReactiveFormsModule,
        CommonModule,
    ],
    providers: [
        AccountSettingsService
    ],
})
export class AccountSettingsModule {
}
