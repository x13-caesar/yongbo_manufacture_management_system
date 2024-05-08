import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Spec} from '../models/spec';
import {PostResponse} from '../models/post-response'
import {Compo} from '../models/compo';

@Injectable({
  providedIn: 'root'
})
export class SpecService {

  constructor(
    private http: HttpClient
  ) { }

  getSpecs(): Observable<Spec[]> {
    return this.http.get<Spec[]>(`${environment.API_URL}/specifications`)
  }

  getHiddenSpecs(): Observable<Spec[]> {
    return this.http.get<Spec[]>(`${environment.API_URL}/specifications/hidden`)
  }

  getSpecById(specification_id: string): Observable<Spec> {
    return this.http.get<Spec>(`${environment.API_URL}/specifications/by_id/${specification_id}`)
  }

  getSpecsByCompoId(compo_id: string): Observable<Spec[]> {
    return this.http.get<Spec[]>(`${environment.API_URL}/specifications/component_id/${compo_id}`)
  }

  adjustSpecStock(spec_id: string, adjust_number: number): Observable<Spec> {
    return this.http.put<Spec>(`${environment.API_URL}/specifications/adjust_stock/${spec_id}/${adjust_number}`, null)
  }

  postSpec(spec: Spec): Observable<Spec> {
    spec.hide = false;
    console.log(spec);
    return this.http.post<Spec>(`${environment.API_URL}/specifications/`, spec)
  }

  putSpec(spec: Spec): Observable<Spec> {
    return this.http.put<Spec>(`${environment.API_URL}/specifications/`, spec)
  }

  hideSpec(spec_id: string): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/specifications/hide/${spec_id}`, null)
  }

  unhideSpec(spec_id: string): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/specifications/unhide/${spec_id}`, null)
  }

  specSearchFilter(specs: Spec[], changes: any): Spec[] {
    changes.notice && (changes.notice = changes.notice.toUpperCase());
    return specs
      .filter(spec => !changes.notice || (spec.notice?.toUpperCase() === changes.notice))
  }

  getExistingIds(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.API_URL}/specifications/existing_ids`)
  }

  deleteSpec(spec_id: string): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${environment.API_URL}/specifications/${spec_id}`)
  }

  getSpecByVendorId(vid: number) {
    return this.http.get<Spec[]>(`${environment.API_URL}/specifications/vendor_id/${String(vid)}`)
  }
}
