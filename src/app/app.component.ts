import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lift-frontend';

  constructor(private _router: Router) {
    _router.events
      .pipe(
        map((route) => {
          if (route instanceof NavigationEnd) {
            window.scrollTo(0, 0);
          }
        })
      )
      .subscribe();
  }
}
