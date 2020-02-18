import { Component, OnInit, OnDestroy } from '@angular/core';
 
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TicketMessage } from '../../../core/models/support-service';
import { ToastrService } from 'ngx-toastr';
import { ArticleDetailsService } from '../article-details/article-details.service';

@Component({
    selector: 'app-arcticle-details',
    templateUrl: 'arcticle-details.component.html',
    styleUrls: ['arcticle-details.component.scss']
})
export class ArcticleDetailsComponent implements OnInit, OnDestroy {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public articleId: string;
    public sendLikeMessage: boolean =false;
    constructor(private _articleDetailsService: ArticleDetailsService,
        private _activatedRoute: ActivatedRoute, private _toastrService: ToastrService) {
        this.articleId = this._activatedRoute.snapshot.paramMap.get('categoryId')
    }

    ngOnInit() { }

    public onClickLike(isLike: 'yes' | 'no'): void {
        const isLiked: boolean = (isLike == 'yes') ? true : false;
        this._sendLike(isLiked);
    }

    private _sendLike(isLiked: boolean): void {
        const isLikedData = {
            articleId: this.articleId,
            like: isLiked,
        }

        this._articleDetailsService.articleUsefull(isLikedData)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data) => {
                this._toastrService.success('Спасибо за ваш ответ. Ваш ответ успешно принят');
                this.sendLikeMessage=true;
            },
                (err) => {
                    const error = err.error;
                    const errorMessage: string = error.message || 'Ошибка';
                    this._toastrService.error(errorMessage);

                })

    }

    ngOnDestroy() { }
}
