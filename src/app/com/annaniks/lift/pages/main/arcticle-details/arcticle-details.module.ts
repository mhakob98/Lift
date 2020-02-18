import { NgModule } from '@angular/core';
import { ArcticleDetailsRoutingModule } from './arcticle-details.routing.module';
import { ArcticleDetailsComponent } from './arcticle-details.component';
import { ArticleDetailsService } from './article-details.service';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [ArcticleDetailsComponent],
    imports: [ArcticleDetailsRoutingModule,SharedModule,CommonModule],
    providers: [ArticleDetailsService]
})
export class ArcticleDetailsModule { }