
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { CommentsRoutingModule } from './comments.routing.module';

@NgModule({
    declarations: [
        CommentsRoutingModule.components
    ],
    imports: [
        CommentsRoutingModule,
        CommonModule,
    ],

    providers: []
})
export class CommentsModule {
}
