import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { ArticleDetailsService } from './article-details.service';
import { ArticleFull, ArticleShort } from '../../../core/models/article';
import { MainService } from '../main.service';

@Component({
    selector: 'app-article-details',
    templateUrl: 'article-details.component.html',
    styleUrls: ['article-details.component.scss']
})
export class ArcticleDetailsComponent implements OnInit, OnDestroy {
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public articleId: string;
    public article: ArticleFull = {} as ArticleFull;
    public articles: ArticleShort[] = [];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _articleDetailsService: ArticleDetailsService,
        private _mainService: MainService
    ) { }

    ngOnInit() {
        this._checkRouteParams();
        this._getArticles();
    }

    private _checkRouteParams(): void {
        this._activatedRoute.params
            .pipe(
                takeUntil(this._unsubscribe$),
                switchMap((params: { arcticleId: string }) => {
                    this.articleId = params.arcticleId;
                    return this._getArticle(this.articleId);
                })
            ).subscribe();
    }

    private _getArticle(articleId: string): Observable<void> {
        return this._articleDetailsService.getArticleById(articleId)
            .pipe(
                map((data) => {
                    this.article = data.data;
                    console.log(data);
                })
            )
    }

    private _getArticles(): void {
        this._mainService.getArticles()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data) => {
                this.articles = data.data;
            })
    }

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}