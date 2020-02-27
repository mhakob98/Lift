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
  public card = [
    { image: "assets/images/previw_card_icon.png", value: "80252", title: "подписчики", chart: "preview-subscribers" },
    { image: "assets/images/preview_card_like_icon.png", value: "80252", title: "Лайки", chart: "preview-likes" }]
  public action = [
    { image: "assets/images/action_posts.png", title: "Посты", value: "152", date: "2 сегодня" },
    { image: "assets/images/action_bookmark.png", title: "Закладки", value: "128", date: "0 сегодня" },
    { image: "assets/images/action_comments.png", title: "Комментарии", value: "389", date: "+55 сегодня" },
    { image: "assets/images/action_subscribe.png", title: "Подписки", value: "410", date: "-124 сегодня" }
  ]
  public slider = [
    {},
    {},
    {},
    {},
    {},
  ]
  public slide1: boolean = true;
  public slide2: boolean = true;
  public slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: false,
    infinite: false,
    speed: 300,
    loop: false,
    autoplay: false,
    autoplayTimeout: 1000,
    autoplayHoverPause: false,
    // prevArrow: "<img class='a-left control-c prev slick-prev'  src='/assets/images/arrow-left.png' >",
    // nextArrow: "<img class='a-right control-c next slick-next' src='/assets/images/arrow-right.png'>",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  }

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

  ngOnInit() { }

  public closeSlider(tab): void {
    if (tab == 1) {
      this.slide1 =! this.slide1;
    }
    else if(tab==2){
      this.slide2 =! this.slide2;
    }
  }

}
