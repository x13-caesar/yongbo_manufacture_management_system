import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Work} from '../models/work';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InstockService {

  constructor(
    private http: HttpClient
  ) { }

}
