
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { PostsRoutingModule } from './posts.routing.module';

@NgModule({
    declarations: [
        PostsRoutingModule.components
    ],
    imports: [
        PostsRoutingModule,
        CommonModule,
    ],

    providers: []
})
export class PostsModule { }
