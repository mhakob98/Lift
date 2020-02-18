import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleDetailsService } from './article-details.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TicketMessage } from '../../../core/models/support-service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-arcticle-details',
    templateUrl: 'arcticle-details.component.html',
    styleUrls: ['arcticle-details.component.scss']
})
export class ArcticleDetailsComponent implements OnInit, OnDestroy {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public articleId: string;
    constructor(private _articleDetailsService: ArticleDetailsService,
        private _activatedRoute: ActivatedRoute, private _toastrService: ToastrService) {
        this.articleId = this._activatedRoute.snapshot.paramMap.get('categoryId')
    }

    ngOnInit() { }

    public articleUsefull(likeValue): void {
        let like: boolean;
        if (likeValue == 'yes') {
            like = true;
        }
        else {
            like = false;
        }
        this._articleDetailsService.articleUsefull({
            articleId: this.articleId,
            like: like,
        })
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data) => {
                this._toastrService.success('Ваш ответ принят');
                console.log(data);
                
            },
                (err) => {
                    const error = err.error;
                    const errorMessage: string = error.message || 'Ошибка';
                    this._toastrService.error(errorMessage);

                })

    }

    ngOnDestroy() { }
}