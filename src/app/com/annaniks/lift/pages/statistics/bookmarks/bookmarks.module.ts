
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Our Modules
import { BookmarksRoutingModule } from './bookmarks.routing.module';

@NgModule({
    declarations: [
        BookmarksRoutingModule.components
    ],
    imports: [
        BookmarksRoutingModule,
        CommonModule,
    ],

    providers: []
})
export class BookmarksModule {
}
