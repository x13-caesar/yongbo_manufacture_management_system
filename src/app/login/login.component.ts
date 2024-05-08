import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/http-services/auth.service';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {JWTTokenService} from '../shared/http-services/jwt-token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    public auth: AuthService,
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    private jwtToken: JWTTokenService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: FormGroup | any): void {
    console.log("sending out login request...")
    this.auth.login(form.value || form).subscribe({
      next: res => {
        if (res.access_token) {
          this.jwtToken.setToken(res.access_token);
          localStorage.setItem ('token', res.access_token);
          this.jwtToken.decodeToken();
          this.router.navigateByUrl('/overview');
          }
        },
      error: err => console.log(err)
    });
  }
}
