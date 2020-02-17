import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ArticleShort } from '../../../../core/models/article';

@Component({
  selector: 'app-header-help',
  templateUrl: './header-help.component.html',
  styleUrls: ['./header-help.component.scss']
})
export class HeaderHelpComponent implements OnInit {
  @Input('articles') public articles: ArticleShort[] = [];
  @Output('close') public closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  public onClickItem(): void {
    this.closeEvent.emit(true);
  }

}
