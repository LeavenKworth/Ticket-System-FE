import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentDevelopment } from './environments/environment.development';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith('http')) {
      const apiReq = req.clone({
        url: `${environmentDevelopment.apiUrl}/${req.url}`
      });
      return next.handle(apiReq);
    }

    return next.handle(req);
  }
}
