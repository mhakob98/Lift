import { NgModule } from '@angular/core';
import { ArcticleDetailsComponent } from './arcticle-details.component';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ArcticleDetailsRoutingModule } from '../article-details/article-details.routing.module';
import { ArticleDetailsService } from '../article-details/article-details.service';

@NgModule({
    declarations: [ArcticleDetailsComponent],
    imports: [ArcticleDetailsRoutingModule,SharedModule,CommonModule],
    providers: [ArticleDetailsService]
})
export class ArcticleDetailsModule { }