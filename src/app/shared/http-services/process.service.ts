import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Process} from '../models/process';
import {environment} from '../../../environments/environment';
import {BatchProcess} from '../models/batch-process';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  constructor(private http: HttpClient) { }

  getProcessesByProductId(product_id: string): Observable<Process[]> {
    return this.http.get<Process[]>(`${environment.API_URL}/process/product_id/${product_id}`)
  }

  getProcessById(id: string): Observable<Process> {
    return this.http.get<Process>(`${environment.API_URL}/process/${id}`)
  }

  sortedProcesses(processes: Process[]): Process[] {
    return processes.sort((a, b) => (Number(a.process_order) - Number(b.process_order)))
  }
}
