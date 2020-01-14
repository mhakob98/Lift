import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie';

export class ApiInterceptor implements HttpInterceptor {

    constructor(
        @Inject("BASE_URL") private _baseUrl: string,
        private _cookieService: CookieService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let params: HttpParams = (req.params) ? req.params : new HttpParams();
        let headers: HttpHeaders = (req.headers) ? req.headers : new HttpHeaders();
        const url: string = `${this._baseUrl}${req.url}`;
        if (!(params.has('authorization') && params.get('authorization') === 'false')) {
            params = params.delete('authorization');
            const accessToken: string = this._cookieService.get('accessToken');
            if (accessToken) {
                headers = headers.append('Authorization', 'Bearer ' + accessToken);
            }
        }
        const clonedReq = req.clone({
            url: url,
            headers: headers,
            params: params
        });
        return next.handle(clonedReq);
    }
}