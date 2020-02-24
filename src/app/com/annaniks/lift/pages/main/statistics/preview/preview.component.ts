import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PreviewService } from './preview.service';
import { catchError, map, filter, tap } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { Preview } from '../../../../core/models/statistics-preview';
import { MatDialog } from '@angular/material/dialog';
import { InstagramAccountChangeModal } from '../../../../core/modals';


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

  constructor(private _previewService: PreviewService, private _matDialog: MatDialog) { }

  ngOnInit() {
  }

  public slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: true,
    infinite: false,
    speed: 300,
    loop: true,
    autoplay: true,
    autoplayTimeout: 1000,
    autoplayHoverPause: true,
    // prevArrow: "<img class='a-left control-c prev slick-prev'  src='/assets/images/arrow-left.png' >",
    // nextArrow: "<img class='a-right control-c next slick-next' src='/assets/images/arrow-right.png'>",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  }

  public openAccontChangeModal(): void {
    const dialogRef = this._matDialog.open(InstagramAccountChangeModal, {
      maxWidth: "80vw",
      width: "600px"
    })
  }
}
