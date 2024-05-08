import { Injectable, Inject, Optional } from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest, HttpEvent} from '@angular/common/http';
import {AuthService} from '../http-services/auth.service';
import {JWTTokenService} from '../http-services/jwt-token.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniversalAppInterceptor implements HttpInterceptor {

  constructor( private authService: AuthService,
               private jwtTokenService: JWTTokenService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.jwtTokenService.jwtToken;
    // console.log(token);
    req = req.clone({
      url:  req.url,
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });
    return next.handle(req);
  }
}
