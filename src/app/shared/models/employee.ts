export interface Employee {
  id?: number,
  name: string,
  gender: string,
  birth?: Date,
  phone: string,
  ssn?: string,
  department?: string,
  status: string,
  onboard?: Date,
  notice?: string,
  last_pay_check?: Date | string,
}
