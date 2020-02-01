// Angular Core Modules
import { NgModule } from '@angular/core';
import { DirectRoutingModule } from './direct.routing.module';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [
        DirectRoutingModule.components,
    ],
    imports: [DirectRoutingModule, CommonModule],
    providers: [],
})
export class DirectModule { }