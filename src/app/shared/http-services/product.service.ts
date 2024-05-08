import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../models/product';
import {environment} from '../../../environments/environment';
import {PostResponse} from '../models/post-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL}/products`)
  }

  getValidProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL}/products/valid`)
  }

  getExistingProductIdsAndNames(): Observable<{id: string; name: string}[]> {
    return this.http.get<{id: string; name: string}[]>(`${environment.API_URL}/products/only_name`)
  }

  getInvalidProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL}/products/invalid`)
  }

  getProductNameById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/products/only_name/${id}`)
  }

  getProductById(product_id: string): Observable<Product> {
    return this.http.get<Product>(`${environment.API_URL}/products/${product_id}`)
  }

  getProductsByName(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL}/products/name/${name}`)
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL}/products/category/${category}`)
  }

  getProductsUnderInventory(inventory: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL}/products/inventory_under/${inventory}`)
  }

  postProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.API_URL}/products`, product)
  }

  putProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.API_URL}/products`, product)
  }

  adjustProductInventory(product_id: string, adjust: number): Observable<Product> {
    return this.http.put<Product>(`${environment.API_URL}/products/adjust_inventory?product_id=${product_id}&adjust_number=${adjust}`, null)
  }

  deleteProduct(product_id: string): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${environment.API_URL}/products/${product_id}`)
  }

  productDisplayFn(prod: Product) {
    return prod && `${prod.name} | ${prod.id}`
  }

  productAutocompleteFilter(input: string, products: Product[]) {
    return products.filter(p => p.name.includes(input) || String(p.id).includes(input));
  }

  productSearchFilter(products: Product[], changes: any): Product[] {
    changes.category && (changes.category = changes.category.toUpperCase());
    changes.keyword && (changes.keyword = changes.keyword.toUpperCase());
    return products
      .filter(prod => !changes.category || (prod.category === changes.category))
      .filter(prod => String(prod.id).toUpperCase().includes(changes.keyword)
        || prod.name.toUpperCase().includes(changes.keyword)
        || prod.description?.toUpperCase().includes(changes.keyword)
        || (prod.notice && prod.notice.toUpperCase().includes(changes.keyword)))
  }

  deprecateProduct(product_id: string): Observable<PostResponse> {
    const now = (new Date()).toISOString();
    return this.http.put<PostResponse>(`${environment.API_URL}/products/deprecate/${product_id}/${now}`, null);
  }

  resumeProduct(product_id: string): Observable<PostResponse> {
    return this.http.put<PostResponse>(`${environment.API_URL}/products/resume/${product_id}`, null);
  }
}
