
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { LikesCommentsBookmarksRoutingModule } from './likes-comments-bookmarks.routing.module';
import { LikesCommentsBookmarksService } from './likes-comments-bookmarks.service';

@NgModule({
    declarations: [
        LikesCommentsBookmarksRoutingModule.components,

    ],
    imports: [
        LikesCommentsBookmarksRoutingModule,
        CommonModule,
    ],

    providers: [LikesCommentsBookmarksService]
})
export class LikesCommentsBookmarksModule { }
