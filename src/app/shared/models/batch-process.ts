import {Work} from './work';
import {Process} from './process';
import {WarehouseRecord} from './warehouse-record';

export interface BatchProcess {
  id?: number,
  status: string,
  process_id: string,
  batch_id: number,
  start_amount?: number,
  end_amount?: number
  unit_pay: number,
  work?: Work[],
  process?: Process,
  warehouse_record?: WarehouseRecord[]
  // for report
  ideal_unit_spec_cost?: number;
  actual_total_spec_cost?: number;
  actual_unit_spec_cost?: number;
  actual_total_work_cost?: number
  actual_overall_cost?: number;
  ideal_total_work_cost?: number;
  // for workflow control
  spec_confirm?: boolean

}
