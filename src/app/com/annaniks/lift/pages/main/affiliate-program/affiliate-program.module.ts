import { NgModule } from '@angular/core';
import { AffiliateProgramRoutingModule } from './affiliate-program.routing.module';
import { AffiliateProgramComponent } from './affiliate-program.component';
import { AffiliateProgramService } from './affiliate-program.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [AffiliateProgramComponent],
    imports: [AffiliateProgramRoutingModule,CommonModule,FormsModule,ReactiveFormsModule],
    providers: [AffiliateProgramService]
})
export class AffiliateProgramModule { }