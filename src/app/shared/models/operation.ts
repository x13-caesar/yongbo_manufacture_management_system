import {ColDef} from 'ag-grid-community';
import {accountingNumberFormatter, dateStringFormatter, datetimeStringFormatter, longIntegerFormatter} from '../util/formatter';
import {InstockItemOperationRendererComponent} from '../../purchase/cell-renderer/instock-item-operation-renderer/instock-item-operation-renderer.component';

export interface Operation {
  id?: number,
  content: string,
  operator: string,
  execute_time: Date | string,
}

export const operation_col_def: ColDef[] = [
  {field: 'id', headerName: '操作记录序列号', filter: true},
  {field: 'content', headerName: '操作内容', minWidth: 600, filter: true},
  {field: 'operator', headerName: '操作用户', filter: true},
  {field: 'execute_time', headerName: '操作时间', minWidth: 240, sort: "desc", filter: 'agDateColumnFilter', valueFormatter: datetimeStringFormatter},
]
