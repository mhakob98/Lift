import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Our Shared Components
import { CommonModule } from '@angular/common';
import { LimitsComponent } from './limits/limits.component';
import { FooterNavigationComponent } from './footer-navigation/footer-navigation.component';
import { LineChartComponent } from './line-chart/line-chart.component';

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


//Forms
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
    declarations: [
        LimitsComponent,
        FooterNavigationComponent,
        LineChartComponent,
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
        PickerModule

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
        PickerModule
    ],
})
export class SharedModule { }
