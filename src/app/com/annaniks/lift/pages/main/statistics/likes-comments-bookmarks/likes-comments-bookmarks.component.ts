
import { Component, OnInit } from '@angular/core';
import { LikesCommentsBookmarksService } from './likes-comments-bookmarks.service';
import { ActivatedRoute } from '@angular/router';

import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Like } from '../../../../core/models/like';
import { Comment } from '../../../../core/models/comment';
import { Bookmark } from '../../../../core/models/bookmark';

@Component({
  selector: 'app-likes-comments-bookmarks',
  templateUrl: './likes-comments-bookmarks.component.html',
  styleUrls: ['./likes-comments-bookmarks.component.scss']
})
export class LikesCommentsBookmarksComponent implements OnInit {
  public data$: Observable<Like | Comment | Bookmark>

  constructor(
    private _likesCommentsBookmarksService: LikesCommentsBookmarksService,
    _activatedRoute: ActivatedRoute
  ) {
    _activatedRoute.data.subscribe((data: { type: string }) => {
      this.data$ = this._loadPreferedDataBasedOnPageType(data.type).pipe(catchError(of));
    })
  }

  ngOnInit() {
  }

  private _loadPreferedDataBasedOnPageType(pageType: string): Observable<Like | Comment | Bookmark> {
    switch (pageType) {
      case 'likes':
        return this._likesCommentsBookmarksService.likes$
      case 'comments':
        return this._likesCommentsBookmarksService.comments$
      case 'bookmarks':
        return this._likesCommentsBookmarksService.bookmarks$
      default:
        break;
    }
  }

}
