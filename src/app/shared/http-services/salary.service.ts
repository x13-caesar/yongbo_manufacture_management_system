import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Work} from '../models/work';
import {environment} from '../../../environments/environment';
import {PostResponse} from '../models/post-response';
import {Salary} from '../models/salary';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor(private http: HttpClient) { }


  getSalaries(): Observable<Salary[]> {
    return this.http.get<Salary[]>(`${environment.API_URL}/salary`)
  }

  getCheckedSalaries():  Observable<Salary[]> {
    return this.http.get<Salary[]>(`${environment.API_URL}/salary/checked`)
  }

  getUncheckedSalaries():  Observable<Salary[]> {
    return this.http.get<Salary[]>(`${environment.API_URL}/salary/unchecked`)
  }

  getSalaryNameById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/salary/only_name/${id}`)
  }

  getSalaryById(salary_id: number): Observable<Salary> {
    return this.http.get<Salary>(`${environment.API_URL}/salary/${salary_id}`)
  }

  getSalariesByEmployeeId(employee_id: number): Observable<Salary[]> {
    return this.http.get<Salary[]>(`${environment.API_URL}/salary/employee_id/${employee_id}`)
  }

  getSalariesInDateRange(after: Date, before: Date): Observable<Salary[]> {
    return this.http.get<Salary[]>(`${environment.API_URL}/salary/salary_date/${after}/${before}`)
  }

  getSalariesByEmployeeIdAndSalaryDate(employee_id: number, after: Date, before: Date): Observable<Salary[]> {
    return this.http.get<Salary[]>(`${environment.API_URL}/salary/employee_id_and_salary_date/${employee_id}/${after}/${before}`)
  }

  postSalary(salary: Salary): Observable<Salary> {
    return this.http.post<Salary>(`${environment.API_URL}/salary`, salary)
  }

  putSalary(salary: Salary): Observable<Salary> {
    return this.http.put<Salary>(`${environment.API_URL}/salary`, salary)
  }

  paySalaryConfirm(salary: Salary): Observable<Salary> {
    return this.http.put<Salary>(`${environment.API_URL}/salary/pay-salary-confirm`, salary)
  }

  deleteSalary(salary_id: number): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${environment.API_URL}/salary/${salary_id}`)
  }

  calculateTotalSalary(salary: Salary): number {
    return Number(salary.hour_salary) + Number(salary.unit_salary) + Number(salary.bonus) - Number(salary.deduction)
  }

  salarySearchFilter(salaries: Salary[], changes: any): Salary[] {
    changes.keyword = changes.keyword.toUpperCase();
    return salaries
      .filter(s => s.employee_name.toUpperCase().includes(changes.keyword))
  }

  downloadSalarySummary(salary_id: number): Observable<Blob> {
    return this.http.get(`${environment.API_URL}/salary/salary-summary/download/${salary_id}.csv`, {responseType: 'blob'})
  }
}
