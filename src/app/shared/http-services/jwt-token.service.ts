import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenService {

  jwtToken: string = '';
  decodedToken: { [key: string]: string } = {};

  constructor(
    public auth: AuthService
  ) {
    this.jwtToken = localStorage.getItem('token') || '';
    this.decodeToken();
  }

  setToken(token: string): void {
    if (token) {
      this.jwtToken = token;
    }
  }

  decodeToken(): void {
    if (this.jwtToken) {
      this.decodedToken = jwt_decode(this.jwtToken);
      this.auth.user = {
        username: this.decodedToken.sub,
        role: this.decodedToken.role
      }
    }
  }

  getDecodeToken(): any {
    return jwt_decode(this.jwtToken);
  }

  getUser(): any {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.sub : null;
  }

  getRole(): any {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.role : null;
  }

  getExpiryTime(): any {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.exp : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: number = this.getExpiryTime();
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  }

  clearAll() {
    this.jwtToken = '';
    this.decodedToken = {};
  }
}
