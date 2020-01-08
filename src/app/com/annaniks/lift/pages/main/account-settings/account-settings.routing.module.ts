import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountSettingsComponent } from './account-settings.component';

import {
    AccountSettingsHeaderComponent,
    MainSettingsComponent,
    ProfileSettingsComponent,
    GoalsSettingsComponent,
    ContactsSettingsComponent
} from './components/index'

const accountSettingsRoute: Routes = [
    { path: '', component: AccountSettingsComponent }
]

@NgModule({
    imports: [RouterModule.forChild(accountSettingsRoute)],
    exports: [RouterModule],
})
export class AccountSettingsRoutingModule {

    static components = [
        AccountSettingsComponent,
        MainSettingsComponent,
        AccountSettingsHeaderComponent,
        ProfileSettingsComponent,
        GoalsSettingsComponent,
        ContactsSettingsComponent
    ]

}