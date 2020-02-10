import { NgModule } from '@angular/core';
import { TicketComponent } from './ticket.component';
import { TicketRoutingModule } from './ticket.routing.module';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
    declarations: [TicketComponent],
    imports: [TicketRoutingModule, SharedModule],
    providers: []
})
export class TicketModule { }