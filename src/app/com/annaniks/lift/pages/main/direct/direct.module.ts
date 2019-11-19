// Angular Core Modules
import { NgModule } from '@angular/core';
import { DirectRoutingModule } from './direct.routing.module';


@NgModule({
    declarations: [
        DirectRoutingModule.components,
    ],
    imports: [DirectRoutingModule],
    providers: [],
})
export class DirectModule { }