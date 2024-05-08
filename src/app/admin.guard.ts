import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './shared/http-services/auth.service';
import {LocalStorageService} from './shared/http-services/local-storage.service';
import {JWTTokenService} from './shared/http-services/jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService,
              private authStorageService: LocalStorageService,
              private jwtService: JWTTokenService,
              private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.jwtService.getRole() === 'omni') {
      return true;
    }
    this.router.navigateByUrl('/transmission/no-permission');
    return false
  }

}
