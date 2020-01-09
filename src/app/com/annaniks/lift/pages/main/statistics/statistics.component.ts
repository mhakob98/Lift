import { Component, OnInit } from '@angular/core';
import { SubmenuItem } from '../../../core/models/submenu-Item';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  public items: SubmenuItem[] = []
  constructor() { }

  ngOnInit() {
    this.items = [
      {
        label: 'Обзор',
        routerLink: '/statistics/preview'
      },
      {
        label: 'Подписчики',
        routerLink: '/statistics/subscribers'
      },
      {
        label: 'Мои подписки',
        routerLink: '/statistics/my-subscribes'
      },
      {
        label: 'Посты',
        routerLink: '/statistics/posts'
      },
      {
        label: 'Лайки',
        routerLink: '/statistics/likes'
      },
      {
        label: 'Комментарии',
        routerLink: '/statistics/comments'
      },
      {
        label: 'Закладки',
        routerLink: '/statistics/bookmarks'
      }
    ]
  }

}
