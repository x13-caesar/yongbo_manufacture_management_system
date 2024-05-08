import {ProcessComponent} from './process-component';

export interface Process {
  id?: string,
  product_id: string,
  process_name: string,
  process_order: number,
  notice: string,
  unit_pay: number,
  process_component: ProcessComponent[]
}
