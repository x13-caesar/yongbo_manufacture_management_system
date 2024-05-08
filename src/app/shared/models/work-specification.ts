import {Spec} from './spec';

export interface WorkSpecification {
  id?: number,
  work_id?: number,
  specification_id: string,
  specification_net_price?: number,
  specification_gross_price?: number,
  component_name?: string,
  plan_amount: number,
  actual_amount?: number
}
