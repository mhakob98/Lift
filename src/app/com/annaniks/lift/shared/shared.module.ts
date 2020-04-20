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
import { NgxMaskModule } from 'ngx-mask';
import { NgxInfiniteScrollerModule } from 'ngx-infinite-scroller';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from 'ngx-mat-datetime-picker';

//Forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material';
import { AudienceFilterComponent } from '../pages/main/promotion/auto-subscribe-or-watch-story';

registerLocaleData(localeRu);

@NgModule({
    declarations: [
        LimitsComponent,
        FooterNavigationComponent,
        LineChartComponent,
        UserDetailsComponent,
        AudienceFilterComponent,
        OnlyNumberDirective,
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
        FormsModule,
        MatRadioModule,
        MatExpansionModule,
        MatInputModule,
        PickerModule,
        NgxInfiniteScrollerModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        NgxMaskModule.forRoot(),
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        MatDatepickerModule,

    ],
    entryComponents: [
        AudienceFilterComponent
    ],

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
        OnlyNumberDirective,
        NgxMaskModule,
        NgxInfiniteScrollerModule,
        FormsModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        MatDatepickerModule,
        AudienceFilterComponent,
    ],
})
export class SharedModule { }
