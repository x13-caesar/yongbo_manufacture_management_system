import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Process} from '../models/process';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private http: HttpClient) { }

  getProcessesByProductId(product_id: number): Observable<Process[]> {
    return this.http.get<Process[]>(`${environment.API_URL}/process/product_id/${product_id}`)
  }

  getProcessById(id: number): Observable<Process> {
    return this.http.get<Process>(`${environment.API_URL}/process/${id}`)
  }
}
