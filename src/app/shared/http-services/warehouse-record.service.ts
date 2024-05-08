import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WarehouseRecord} from '../models/warehouse-record';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseRecordService {
  target_url = `${environment.API_URL}/warehouse_record`

  constructor(private http: HttpClient) { }

  getWarehouseRecordsByBatchProcessId(bp_id: number): Observable<WarehouseRecord[]> {
    return this.http.get<WarehouseRecord[]>(`${this.target_url}/batch_process_id/${bp_id}`)
  }

  postWarehouseRecord(wr: WarehouseRecord): Observable<WarehouseRecord> {
    console.log(wr)
    return this.http.post<WarehouseRecord>(`${this.target_url}`, wr)
  }

  putWarehouseRecord(wr: WarehouseRecord): Observable<WarehouseRecord> {
    return this.http.put<WarehouseRecord>(`${this.target_url}`, wr)
  }
}
