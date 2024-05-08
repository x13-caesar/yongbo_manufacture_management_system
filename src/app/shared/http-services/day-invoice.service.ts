import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Work} from '../models/work';
import {environment} from '../../../environments/environment';
import {PostResponse} from '../models/post-response';
import {DayInvoice} from './day-invoice';

@Injectable({
  providedIn: 'root'
})
export class DayInvoiceService {

  constructor(private http: HttpClient) { }


  getDayInvoices(): Observable<DayInvoice[]> {
    return this.http.get<DayInvoice[]>(`${environment.API_URL}/day_invoice`)
  }

  getCheckedDayInvoices():  Observable<DayInvoice[]> {
    return this.http.get<DayInvoice[]>(`${environment.API_URL}/day_invoice/checked`)
  }

  getUncheckedDayInvoices():  Observable<DayInvoice[]> {
    return this.http.get<DayInvoice[]>(`${environment.API_URL}/day_invoice/unchecked`)
  }

  getDayInvoiceById(dayInvoice_id: number): Observable<DayInvoice> {
    return this.http.get<DayInvoice>(`${environment.API_URL}/day_invoice/${dayInvoice_id}`)
  }

  getDayInvoicesByEmployeeId(employee_id: number): Observable<DayInvoice[]> {
    return this.http.get<DayInvoice[]>(`${environment.API_URL}/day_invoice/employee_id/${employee_id}`)
  }

  getDayInvoicesInDateRange(after: Date, before: Date): Observable<DayInvoice[]> {
    return this.http.get<DayInvoice[]>(`${environment.API_URL}/day_invoice/day_invoice_date/${after.toISOString()}/${before.toISOString()}`)
  }

  getDayInvoicesByEmployeeIdAndDayInvoiceDate(employee_id: number, after: Date, before: Date): Observable<DayInvoice[]> {
    return this.http.get<DayInvoice[]>(`${environment.API_URL}/day_invoice/employee_id_and_day_invoice_date/${employee_id}/${after.toISOString()}/${before.toISOString()}`)
  }

  getUncheckedDayInvoicesByEmployeeIdAndDayInvoiceDate(employee_id: number, after: Date, before: Date): Observable<DayInvoice[]> {
    return this.http.get<DayInvoice[]>(`${environment.API_URL}/day_invoice/unchecked/employee_id_and_work_date/${employee_id}/${after.toISOString()}/${before.toISOString()}`)
  }

  postDayInvoice(dayInvoice: DayInvoice): Observable<DayInvoice> {
    console.log(dayInvoice);
    return this.http.post<DayInvoice>(`${environment.API_URL}/day_invoice`, dayInvoice)
  }

  putDayInvoice(dayInvoice: DayInvoice): Observable<DayInvoice> {
    return this.http.put<DayInvoice>(`${environment.API_URL}/day_invoice`, dayInvoice)
  }

  deleteDayInvoice(day_invoice_id: number): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${environment.API_URL}/day_invoice/${day_invoice_id}`)
  }

  sortDayInvoiceByDate(dayInvoices: DayInvoice[]): DayInvoice[] {
    return dayInvoices.sort((a, b) => (Number(a.work_date) - Number(b.work_date)))
  }

  dayInvoiceAutocompleteFilter(dayInvoices: DayInvoice[], input: string): DayInvoice[] {
    return dayInvoices.filter(w => String(w.employee_id).includes(input) || w.employee_name.includes(input));
  }

  dayInvoiceSearchFilter(dayInvoices: DayInvoice[], keyword: string): DayInvoice[] {
    return dayInvoices.filter(di => di.employee_name.includes(keyword) || di.process_name.includes(keyword) || String(di.batch_id).includes(keyword));
  }

  dayInvoiceDisplayFn(dayInvoice: DayInvoice) {
    return dayInvoice ? `${dayInvoice.employee_name} (${dayInvoice.employee_id})` : ''
  }
}
