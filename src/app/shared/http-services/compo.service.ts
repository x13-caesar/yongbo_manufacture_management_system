import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Product} from '../models/product';
import {environment} from '../../../environments/environment';
import {Compo, CompoCategory} from '../models/compo';
import {PostResponse} from '../models/post-response';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompoService {

  constructor(
    private http: HttpClient,
  ) { }

  getCompos(): Observable<Compo[]> {
    return this.http.get<Compo[]>(`${environment.API_URL}/components`)
  }

  getHiddenCompos(): Observable<Compo[]> {
    return this.http.get<Compo[]>(`${environment.API_URL}/components/hidden`)
  }

  getCompoCategories(): Observable<CompoCategory[]> {
    return this.http.get<CompoCategory[]>(`${environment.API_URL}/components/all_categories`)
  }

  getCompo(id: string): Observable<Compo> {
    return this.http.get<Compo>(`${environment.API_URL}/components/${id}`)
  }

  postCompo(compo: Compo): Observable<Compo> {
    // console.log(compo);
    compo.hide = false;
    return this.http.post<Compo>(`${environment.API_URL}/components`, compo)
  }

  putCompo(compo: Compo): Observable<Compo> {
    return this.http.put<Compo>(`${environment.API_URL}/components`, compo)
  }

  hideCompo(compo_id: string): Observable<Compo> {
    return this.http.put<Compo>(`${environment.API_URL}/components/hide/${compo_id}`, null)
  }

  unhideCompo(compo_id: string): Observable<Compo> {
    return this.http.put<Compo>(`${environment.API_URL}/components/unhide/${compo_id}`, null)
  }

  compoSearchFilter(compos: Compo[], changes: any): Compo[] {
    changes.material && (changes.material = changes.material.toUpperCase());
    changes.keyword && (changes.keyword = changes.keyword.toUpperCase());
    return compos
      .filter(compo => !changes.category || (compo.category.toUpperCase() === changes.category))
      .filter(compo => !changes.material || (compo.model?.toUpperCase() === changes.model))
      .filter(compo => compo.id?.includes(changes.keyword)
        || compo.name.toUpperCase().includes(changes.keyword)
        || compo.description?.toUpperCase().includes(changes.keyword)
        || (compo.notice && compo.notice.toUpperCase().includes(changes.keyword)))
  }

  compoAutocompleteFilter(value: string, compos: Compo[]): Compo[] {
    value = value.toUpperCase();
    return compos.filter(c => c.name.includes(value) || c.id?.includes(value));
  }

  compoDisplayFn(compo: Compo): string {
    return compo && compo.name ? `${compo.name} | ${compo.id}` : '';
  }
}
