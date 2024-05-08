import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WorkSpecification} from '../models/work-specification';
import {environment} from '../../../environments/environment';
import {PostResponse} from '../models/post-response';

@Injectable({
  providedIn: 'root'
})
export class WorkSpecificationService {

  constructor(private http: HttpClient) { }


  getWorkSpecifications(): Observable<WorkSpecification[]> {
    return this.http.get<WorkSpecification[]>(`${environment.API_URL}/work_specification`)
  }

  getWorkSpecificationById(work_specification_id: number): Observable<WorkSpecification> {
    return this.http.get<WorkSpecification>(`${environment.API_URL}/work_specification/${work_specification_id}`)
  }

  getWorkSpecificationsByWorkId(work_id: number): Observable<WorkSpecification[]> {
    return this.http.get<WorkSpecification[]>(`${environment.API_URL}/work_specification/employee_id/${work_id}`)
  }

  postWorkSpecification(work_specification: WorkSpecification): Observable<WorkSpecification> {
    return this.http.post<WorkSpecification>(`${environment.API_URL}/work_specification`, work_specification)
  }

  putWorkSpecification(work_specification: WorkSpecification): Observable<WorkSpecification> {
    return this.http.put<WorkSpecification>(`${environment.API_URL}/work_specification`, work_specification)
  }

  deleteWorkSpecification(work_specification_id: number): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${environment.API_URL}/work_specification/${work_specification_id}`)
  }
}
