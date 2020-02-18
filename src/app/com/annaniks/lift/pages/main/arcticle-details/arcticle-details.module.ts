import { NgModule } from '@angular/core';
import { ArcticleDetailsRoutingModule } from './arcticle-details.routing.module';
import { ArcticleDetailsComponent } from './arcticle-details.component';
import { ArticleDetailsService } from './article-details.service';

@NgModule({
    declarations: [ArcticleDetailsComponent],
    imports: [ArcticleDetailsRoutingModule],
    providers: [ArticleDetailsService]
})
export class ArcticleDetailsModule { }