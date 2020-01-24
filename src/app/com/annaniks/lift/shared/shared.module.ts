import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Our Shared Components
import { CommonModule } from '@angular/common';
import { LimitsComponent } from './limits/limits.component';
import { FooterNavigationComponent } from './footer-navigation/footer-navigation.component';
import { LineChartComponent } from './line-chart/line-chart.component';

// 3rd Part Libraries
import { NgxEchartsModule } from 'ngx-echarts';
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

//Forms
import { ReactiveFormsModule } from '@angular/forms';

// 3rd part libraries
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
    declarations: [
        LimitsComponent,
        FooterNavigationComponent,
        LineChartComponent,
    ],

    imports: [
        CommonModule,
        RouterModule,
        NgxEchartsModule,
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
    exports: [
        LimitsComponent,
        NgxEchartsModule,
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
