import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/http-services/auth.service';
import {JWTTokenService} from '../shared/http-services/jwt-token.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public jwtTokenService: JWTTokenService
  ) { }

  version = environment.version

  ngOnInit(): void {
  }

  onLogout() {
    this.auth.logout();
    this.jwtTokenService.clearAll();
  }
}
