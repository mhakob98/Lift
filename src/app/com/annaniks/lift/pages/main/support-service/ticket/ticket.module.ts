import { NgModule } from '@angular/core';
import { TicketComponent } from './ticket.component';
import { TicketRoutingModule } from './ticket.routing.module';

@NgModule({
    declarations: [TicketComponent],
    imports: [TicketRoutingModule],
    providers: []
})
export class TicketModule { }