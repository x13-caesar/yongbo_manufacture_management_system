import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Buyer} from '../models/buyer';
import {environment} from '../../../environments/environment';
import {PostResponse} from '../models/post-response';

@Injectable({
  providedIn: 'root'
})
export class BuyerService {

  constructor(private http: HttpClient) { }

  getBuyers(): Observable<Buyer[]> {
    return this.http.get<Buyer[]>(`${environment.API_URL}/buyers`)
  }

  getBuyer(id: number): Observable<Buyer> {
    return this.http.get<Buyer>(`${environment.API_URL}/buyers/${id}`)
  }

  getBuyerByCompany(company: string): Observable<Buyer> {
    return this.http.get<Buyer>(`${environment.API_URL}/buyers/company/${company}`)
  }

  getBuyerByName(name: string): Observable<Buyer> {
    return this.http.get<Buyer>(`${environment.API_URL}/buyers/name/${name}`)
  }

  postBuyer(buyer: Buyer): Observable<Buyer> {
    return this.http.post<Buyer>(`${environment.API_URL}/buyers`, buyer)
  }

  putBuyer(buyer: Buyer): Observable<Buyer> {
    return this.http.put<Buyer>(`${environment.API_URL}/buyers`, buyer)
  }

  deleteBuyer(buyer_id: number): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${environment.API_URL}/buyers/${buyer_id}`)
  }

}
