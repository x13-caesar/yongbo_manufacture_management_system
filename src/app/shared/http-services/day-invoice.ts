export interface DayInvoice {
  id?: string,
  batch_id: number,
  process_name: string,
  employee_id: number,
  employee_name: string,
  work_date: Date | string,
  unit_pay: number,
  complete_unit: number,
  hour_pay: number,
  complete_hour: number,
  check_status: boolean,
  check_date?: Date | string,
  salary_id?: number
}
