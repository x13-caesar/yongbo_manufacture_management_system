import {Work} from './work';
import {DayInvoice} from '../http-services/day-invoice';

export interface Salary {
  id?: number,
  employee_id: number,
  employee_name: string,
  start_date: Date | string,
  end_date: Date | string,
  unit_salary: number,
  hour_salary: number,
  deduction: number,
  bonus: number,
  status: string,
  notice: string,
  check_date?: Date | string,
  day_invoice?: DayInvoice[]
  work?: Work[]
}
