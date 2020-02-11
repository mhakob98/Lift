import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Our Shared Components
import { CommonModule, registerLocaleData } from '@angular/common';
import {
    LimitsComponent,
    FooterNavigationComponent,
    LineChartComponent,
    UserDetailsComponent
} from './components';

// Our Shared Directives
import { OnlyNumberDirective } from './directives';

// 3rd Part Libraries
import { ClickOutsideModule } from 'ng-click-outside';

// PrimeNG
import { AutoCompleteModule } from 'primeng/autocomplete';

// Angular Material
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';

// 3rd part libraries
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import localeRu from '@angular/common/locales/ru';
//Forms
import { ReactiveFormsModule } from '@angular/forms';

registerLocaleData(localeRu);

@NgModule({
    declarations: [
        LimitsComponent,
        FooterNavigationComponent,
        LineChartComponent,
        UserDetailsComponent,
        OnlyNumberDirective
    ],
    imports: [
        CommonModule,
        RouterModule,
        ClickOutsideModule,
        AutoCompleteModule,
        MatSliderModule,
        MatCheckboxModule,
        MatDialogModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatExpansionModule,
        MatInputModule,
        PickerModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        })

    ],
    entryComponents: [],

    exports: [
        LimitsComponent,
        ClickOutsideModule,
        FooterNavigationComponent,
        LineChartComponent,
        AutoCompleteModule,
        MatSliderModule,
        MatCheckboxModule,
        MatDialogModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatExpansionModule,
        MatInputModule,
        PickerModule,
        UserDetailsComponent,
        CalendarModule,
        OnlyNumberDirective
    ],
})
export class SharedModule { }
