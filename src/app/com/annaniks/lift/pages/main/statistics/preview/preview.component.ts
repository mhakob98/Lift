import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PreviewService } from './preview.service';
import { catchError, map, filter, tap } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { Preview } from '../../../../core/models/statistics-preview';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit {

  private _preview$ = this._previewService.preview$
    .pipe(catchError(of))

  private _bestPostsForLastMonth$ = this._preview$.pipe(
    map((p: Preview) => p ? p.bestPostsForLastMonth : null)
  )

  private _mailingsForLastMonth$ = this._preview$.pipe(
    map((p: Preview) => p ? p.mailingsForLastMonth : null)
  )

  // TODO: Use async pipe to use this stream
  // It will automaticly subscribe and unsubscribe
  public vm$ = combineLatest(
    [this._preview$,
    this._bestPostsForLastMonth$,
    this._mailingsForLastMonth$])
    .pipe(
      filter(([preview]) => !!preview),
      map(([preview, bestPostsForLastMonth, mailingsForLastMonth]) =>
        ({ preview, bestPostsForLastMonth, mailingsForLastMonth }))
    )

  constructor(private _previewService: PreviewService) { }

  ngOnInit() {
  }

}
