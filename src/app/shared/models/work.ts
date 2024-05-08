import {WorkSpecification} from './work-specification';
import {accountingNumberFormatter, dateStringFormatter} from '../util/formatter';
import {ColDef} from 'ag-grid-community';

export interface Work {
  id?: number,
  batch_process_id: number,
  batch_id: number,
  employee_id: number,
  employee_name: string,
  work_date: Date | string,
  plan_unit: number,
  unit_pay: number,
  complete_unit: number,
  hour_pay: number,
  complete_hour: number,
  work_specification?: WorkSpecification[],
  product_name: string,
  process_name: string,
  check: boolean,
  salary_id?: number,
  // the following ones are for report
  actual_unit_spec_cost?: number,
  actual_total_spec_cost?: number;
  actual_unit_overall_cost?: number
}


export const work_grid_def: ColDef[] = [
  {
    field: 'batch_id',
    headerName: '批次编号',
    filter: true,
  },
  {
    field: 'process_name',
    headerName: '工艺名称',
    filter: 'agTextColumnFilter',
  },
  {
    field: 'employee_id',
    headerName: '工号',
    filter: 'agTextColumnFilter',
  },
  {
    field: 'employee_name',
    headerName: '员工名称',
    filter: 'agTextColumnFilter',
  },
  {
    field: 'work_date',
    headerName: '日期',
    filter: 'agDateColumnFilter',
    valueFormatter: dateStringFormatter,
  },
  {
    field: 'unit_pay',
    headerName: '单位酬劳',
    filter: 'agNumberColumnFilter',
    valueFormatter: accountingNumberFormatter,
  },
  {
    field: 'complete_unit',
    headerName: '完成数量',
    filter: 'agNumberColumnFilter',
  },
  {
    field: 'hour_pay',
    headerName: '小时酬劳',
    filter: 'agNumberColumnFilter',
    valueFormatter: accountingNumberFormatter,
  },
  {
    field: 'complete_hour',
    headerName: '工作小时',
    filter: 'agNumberColumnFilter',
  },
  {
    field: 'check_status',
    headerName: '结算状态',
    filter: 'agTextColumnFilter',
  },
  {
    field: 'check_date',
    headerName: '结算日期',
    filter: 'agDateColumnFilter',
    valueFormatter: dateStringFormatter,
  },
];
