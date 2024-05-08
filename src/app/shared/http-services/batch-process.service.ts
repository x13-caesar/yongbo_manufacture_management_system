import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BatchProcess} from '../models/batch-process';
import {environment} from '../../../environments/environment';
import {Batch} from '../models/batch';
import {ProcessService} from './process.service';

@Injectable({
  providedIn: 'root'
})
export class BatchProcessService {

  constructor(
    private http: HttpClient,
    private processService: ProcessService,
    ) { }

  getBatchProcessById(id: number): Observable<BatchProcess> {
    return this.http.get<BatchProcess>(`${environment.API_URL}/batch_process/${id}`)
  }

  postBatchProcess(bp: BatchProcess): Observable<BatchProcess> {
    return this.http.post<BatchProcess>(`${environment.API_URL}/batch_process`, bp)
  }

  postBatchProcessesByBatch(batch: Batch): BatchProcess[] {
    const bp_array: BatchProcess[] = []
    this.processService.getProcessesByProductId(batch.product_id).subscribe(
      processes => {
      this.processService.sortedProcesses(processes).forEach(p => {
          const bp: BatchProcess = {unit_pay: p.unit_pay, batch_id: Number(batch.id), process_id: String(p.id), status: 'unstarted'};
          this.postBatchProcess(bp).subscribe(
            bp => bp_array.push(bp)
          )})
      }
    )
    return bp_array;
  }

  putBatchProcess(bp: BatchProcess): Observable<BatchProcess> {
    return this.http.put<BatchProcess>(`${environment.API_URL}/batch_process`, bp)
  }

  finishBatchProcess(bp: BatchProcess): Observable<BatchProcess> {
    console.log(bp);
    return this.http.put<BatchProcess>(`${environment.API_URL}/batch_process/finish`, bp)
  }

  sortedBatchProcesses(bp_array: BatchProcess[]): BatchProcess[] {
    return bp_array.sort((a, b) => (Number(a.process?.process_order) - Number(b.process?.process_order)))
  }

  batchProcessAutocompleteFilter(bps: BatchProcess[], input: string): BatchProcess[] {
    return bps.filter(bp => bp.process?.process_name.includes(input) || String(bp.process?.process_order).startsWith(input));
  }

  batchProcessDisplayFn(bp: BatchProcess) {
    return bp ? `${bp.process?.process_order} - ${bp.process?.process_name}` : ''
  }
}
