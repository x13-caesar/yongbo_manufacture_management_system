import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Salary} from '../models/salary';
import {environment} from '../../../environments/environment';
import {ProductCategory} from '../models/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  constructor(private http: HttpClient) { }

  getAllProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${environment.API_URL}/product_category`)
  }

  postProductCategory(productCategory: ProductCategory): Observable<ProductCategory> {
    return this.http.post<ProductCategory>(`${environment.API_URL}/product_category`, productCategory)
  }
}
