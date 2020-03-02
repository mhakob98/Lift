
// Angular Core Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPostStoryComponent } from './add-post-story/add-post-story.component';

// Our Modules
import { AutopostingRoutingModule } from './autoposting.routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//modal
import { PopUpModal } from '../../../core/modals';
import { AutoPostingService } from './autoposting.service';


@NgModule({
    declarations: [
        AutopostingRoutingModule.components,
        AddPostStoryComponent,
        PopUpModal
    ],
    imports: [
        CommonModule,
        AutopostingRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    entryComponents: [
        AddPostStoryComponent, 
        PopUpModal
    ],
    providers:[
        AutoPostingService
    ],
    exports: []
})
export class AutopostingModule {
}
