import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Batch} from '../models/batch';
import {environment} from '../../../environments/environment';
import {Operation} from '../models/operation';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(private http: HttpClient) { }

  getRecentOperations(): Observable<Operation[]> {
    return this.http.get<Operation[]>(`${environment.API_URL}/operation/recent`)
  }

  getAllOperations(): Observable<Operation[]> {
    return this.http.get<Operation[]>(`${environment.API_URL}/operation`)
  }

}
