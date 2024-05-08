import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Work} from '../models/work';
import {environment} from '../../../environments/environment';
import {PostResponse} from '../models/post-response';
import {BatchProcess} from '../models/batch-process';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  constructor(private http: HttpClient) { }


  getWorks(): Observable<Work[]> {
    return this.http.request<Work[]>( 'GET', `${environment.API_URL}/work`)
  }

  getCheckedWorks():  Observable<Work[]> {
    return this.http.get<Work[]>(`${environment.API_URL}/work/checked`)
  }

  getUncheckedWorks():  Observable<Work[]> {
    return this.http.get<Work[]>(`${environment.API_URL}/work/unchecked`)
  }

  getWorkById(work_id: number): Observable<Work> {
    return this.http.get<Work>(`${environment.API_URL}/work/${work_id}`)
  }

  getWorksByEmployeeId(employee_id: number): Observable<Work[]> {
    return this.http.get<Work[]>(`${environment.API_URL}/work/employee_id/${employee_id}`)
  }

  getWorksInDateRange(after: Date, before: Date): Observable<Work[]> {
    return this.http.get<Work[]>(`${environment.API_URL}/work/work_date/${after.toISOString()}/${before.toISOString()}`)
  }

  getWorksByEmployeeIdAndWorkDate(employee_id: number, after: Date, before: Date): Observable<Work[]> {
    return this.http.get<Work[]>(`${environment.API_URL}/work/employee_id_and_work_date/${employee_id}/${after.toISOString()}/${before.toISOString()}`)
  }

  getUncheckedWorksByEmployeeIdAndWorkDate(employee_id: number, after: Date, before: Date): Observable<Work[]> {
    return this.http.get<Work[]>(`${environment.API_URL}/work/unchecked/employee_id_and_work_date/${employee_id}/${after.toISOString()}/${before.toISOString()}`)
  }

  postWork(work: Work): Observable<Work> {
    return this.http.post<Work>(`${environment.API_URL}/work`, work)
  }

  putWork(work: Work): Observable<Work> {
    console.log(work);
    return this.http.put<Work>(`${environment.API_URL}/work`, work)
  }

  deleteWork(work_id: number): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${environment.API_URL}/work/${work_id}`)
  }

  sortWorkByDate(works: Work[]): Work[] {
    return works.sort((a, b) => (Number(a.work_date) - Number(b.work_date)))
  }

  workAutocompleteFilter(works: Work[], input: string): Work[] {
    return works.filter(w => String(w.employee_id).includes(input) || w.employee_name.includes(input));
  }

  workSearchFilter(works: Work[], keyword: string): Work[] {
    return works.filter(w => String(w.process_name).includes(keyword) || String(w.employee_name).includes(keyword));
  }

  workDisplayFn(work: Work) {
    return work ? `${work.employee_name} (${work.employee_id})` : ''
  }
}
