import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';

import { CookieModule } from 'ngx-cookie';
import { ApiInterceptor } from './com/annaniks/lift/core/interceptors/api.interceptor';
import { AuthGuard } from './com/annaniks/lift/core/guards/auth.guard';
import { JwtInterceptor } from './com/annaniks/lift/core/interceptors/jwt.interceptor';
import { LoadingService } from './com/annaniks/lift/core/services/loading-service';
import { LoadingComponent } from './com/annaniks/lift/layout/loading/loading.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [
    AuthGuard,
    LoadingService,
    {
      provide: 'BASE_URL',
      useValue: environment.apiUrl,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
