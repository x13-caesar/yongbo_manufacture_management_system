import {ColDef, ValueGetterParams} from 'ag-grid-community';
import {
  accountingNumberFormatter,
  booleanFormatter,
  dateStringFormatter,
  datetimeStringFormatter,
  longIntegerFormatter
} from '../util/formatter';
import {Vendor} from './vendor';
import {InstockItemOperationRendererComponent} from '../../purchase/cell-renderer/instock-item-operation-renderer/instock-item-operation-renderer.component';
import {InstockFormOperationRendererComponent} from '../../purchase/cell-renderer/instock-form-operation-renderer/instock-form-operation-renderer.component';
import {InstockEventCellRendererComponent} from '../../purchase/cell-renderer/instock-event-cell-renderer/instock-event-cell-renderer.component';
import {statusStyle} from '../util/cell-styles';

export interface InstockForm {
  form_id?: number;
  vendor_id?: number;
  display_vendor_id?: string;
  create_time?: string;
  form_status: string;
  amount: number;
  paid: boolean;
  note?: string;
  vendor?: Vendor;
  instock_item?: InstockItem[];
}

export interface InstockItem {
  instock_item_id?: number;
  form_id?: number;
  specification_id: string,
  order_quantity: number
  unit_cost: number
  warehouse_quantity: number
  instock_date: string;
  vendor_instock_date?: string;
  last_time?: string
  notice?: string;
  name?: string;
  model?: string;
  as_unit?: string;
  unit_amount?: number;
  vendor_id?: number;
  display?: { company: string, created_time: string, component_name: string, model: string, as_unit: string, };
}

export interface InstockRecord {
  id: number;
  instock_item_id: number;
  amount_in: number;
  balance: number;
  operator: string;
  record_time: string;
  note: string;
}

export const formStatusMap = {
  'ongoing': '进行中',
  'unstarted': '未开始',
  'finished': '已完成',
  'cancelled': '已取消',
}

function formStatusGetter(params: ValueGetterParams) {
  const statusValue = params.data.form_status;
  return formStatusMap[statusValue]
}

function paidStatusGetter(params: ValueGetterParams){
  const paid = params.data.paid
  return paid ? '是' : '否';
}

export const instock_form_col_def: ColDef[] = [
  {field: 'form_id', headerName: '采购单编号', hide: true,},
  {field: 'display_form_id', headerName: '[生成]采购单编号', filter: true, headerCheckboxSelection: true,
    checkboxSelection: true,
    showDisabledCheckboxes: true,},
  {field: 'display_vendor_id', headerName: '供应商编号', filter: true},
  {field: 'vendor.company', headerName: '供应商公司', filter: true, minWidth: 240},
  {field: 'create_time', headerName: '创建时间', filter: 'agDateColumnFilter', cellDataType: 'dateString'},
  {field: 'form_status', headerName: '状态', filter: true, valueGetter: formStatusGetter, cellStyle: statusStyle},
  {field: 'amount', headerName: '总价', filter: 'agNumberFilter', valueFormatter: accountingNumberFormatter},
  {field: 'paid', headerName: '是否已付款', cellDataType: 'boolean', filter: true, editable: true,},
  {headerName: '操作', minWidth: 420, cellRenderer: InstockFormOperationRendererComponent},
  {field: 'note', headerName: '备注', filter: true, minWidth: 240},
]

function debitQuantityValueGetter(params: ValueGetterParams): number {
  return params.data.order_quantity - (params.data.warehouse_quantity | 0)
}

export const instock_item_col_def: ColDef[] = [
  {field: 'instock_item_id', headerName: '采购内容序列号', hide: true, filter: true},
  {field: 'display_form_id', headerName: '[生成]采购单编号', filter: false},
  {field: 'op', headerName: '操作', minWidth: 360, cellRenderer: InstockItemOperationRendererComponent},
  {field: 'display.company', headerName: '供应商', filter: true},
  {field: 'form_id', headerName: '采购单编号', hide: true},
  {field: 'display.create_time', headerName: '下单日期', filter: true, valueFormatter: dateStringFormatter},
  {field: 'instock_date', headerName: '计划交期', filter: 'agDateFilter', valueFormatter: dateStringFormatter},
  {field: 'notice', headerName: '备注', filter: true, },
  {field: 'vendor_instock_date', headerName: '供应商回复交期', cellDataType: 'dateString',
    filter: 'agDateFilter', editable: true, cellEditor: 'agDateStringCellEditor'},
  {field: 'specification_id', headerName: '物料编号', filter: true},
  {field: 'display.component_name', headerName: '物料名称', filter: true},
  {field: 'display.model', headerName: '型号', filter: true},
  {field: 'display.as_unit', headerName: '单位', filter: true},
  {field: 'order_quantity', headerName: '订购数量', filter: 'agNumberFilter', valueFormatter: longIntegerFormatter},
  {field: 'unit_cost', headerName: '订购单价', hide: true, filter: 'agNumberFilter', valueFormatter: accountingNumberFormatter},
  {field: 'debit_quantity', headerName: '未入库数量', filter: 'agNumberFilter', valueFormatter: longIntegerFormatter, valueGetter: debitQuantityValueGetter, cellStyle: {"font-weight": "bold", "color": "darkorange"}},
  {field: 'warehouse_quantity', headerName: '已入库数量', filter: 'agNumberFilter', valueFormatter: longIntegerFormatter, cellStyle: {"font-weight": "bold", "color": "royalblue"}},
  {field: 'last_time', headerName: '最后更新于', filter: 'agDateColumnFilter', valueFormatter: dateStringFormatter},
]

// 为入库对话窗口设计
export const instock_detail_col_def: ColDef[] = [
  {field: 'instock_item_id', headerName: '采购内容序列号', hide: true, filter: false},
  {field: 'specification_id', headerName: '物料编号', filter: false},
  {field: 'display.component_name', headerName: '物料名称', filter: true},
  {field: 'order_quantity', headerName: '采购数量', filter: false, valueFormatter: longIntegerFormatter},
  {field: 'debit_quantity', headerName: '未入库数量', filter: 'agNumberFilter', valueFormatter: longIntegerFormatter, valueGetter: debitQuantityValueGetter, cellStyle: {"font-weight": "bold", "color": "darkorange"}},
  {field: 'warehouse_quantity', headerName: '已入库数量', filter: false, valueFormatter: longIntegerFormatter, cellStyle: {"font-weight": "bold", "color": "royalblue"}},
  {field: 'instock_input', headerName: '新入库数量', minWidth: 360, cellRenderer: InstockEventCellRendererComponent},
  {field: 'instock_date', headerName: '计划交期', filter: false, valueFormatter: dateStringFormatter},
  {field: 'vendor_instock_date', headerName: '供应商回复交期', filter: false, valueFormatter: dateStringFormatter},
  {field: 'last_time', headerName: '最后更新于', filter: false, valueFormatter: datetimeStringFormatter,},
  {field: 'notice', headerName: '备注', filter: false, minWidth: 240},
]

export const instock_record_col_def: ColDef[] = [
  {field: 'id', headerName: '记录编号', hide: false},
  {field: 'instock_item_id', headerName: '采购内容序列号', hide: true, filter: true},
  {field: 'display.company', headerName: '供应商', filter: true},
  {field: 'display.specification_id', headerName: '物料编号', filter: true},
  {field: 'display.component_name', headerName: '物料名称', filter: true},
  {field: 'display.model', headerName: '物料型号', filter: true},
  {field: 'amount_in', headerName: '本次入库数量', valueFormatter: longIntegerFormatter},
  {field: 'balance', headerName: '记录后总入库数量', valueFormatter: longIntegerFormatter},
  {field: 'record_time', headerName: '入库时间', valueFormatter: datetimeStringFormatter},
  {field: 'display.form_id', headerName: '采购单编号', filter: true},
  {field: 'display.total_value', headerName: '入库价值金额'},
  {field: 'display.notice', headerName: '采购备注'},
  {field: 'display.paid', headerName: '是否付款', valueFormatter: booleanFormatter},
  {field: 'display.use_net', headerName: '使用税前价', valueFormatter: booleanFormatter},
  {field: 'operator', headerName: '操作员'},
  {field: 'note', headerName: '入库备注'}
]

// 为采购单预览对话窗口设计
export const instock_form_single_view_col_def: ColDef[] = [
  {field: 'instock_item_id', headerName: '采购内容序列号', hide: true, filter: false},
  {field: 'specification_id', headerName: '物料编号（规格号）', filter: false},
  {field: 'name', headerName: '物料名称', filter: false},
  {field: 'model', headerName: '型号', filter: false},
  {field: 'order_quantity', headerName: '采购数量', filter: false, valueFormatter: longIntegerFormatter},
  {field: 'as_unit', headerName: '单位', filter: false},
  {field: 'unit_price', headerName: '单价', filter: false, valueFormatter: accountingNumberFormatter},
  {field: 'instock_date', headerName: '到货时间', filter: false, valueFormatter: dateStringFormatter},
  {field: 'unit_amount', headerName: '包装数量', filter: false},
  {field: 'notice', headerName: '备注', filter: false, minWidth: 240},
]
